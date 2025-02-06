import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Put,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Query,
  ParseFloatPipe,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreatePharmacyDto } from './dto/createPharmacy';
import { UpdatePharmacyDto } from './dto/updatePharmacy';
import { Pharmacy } from 'src/schemas/pharmacy.schema';
import { PharmacyServices } from './pharmacy.service';
import { Roles } from 'src/auth/roles/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('pharmacies')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyServices) {}

  // Create a new pharmacy

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const prefix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
          const filename = `${prefix}${extname(file.originalname)}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Invalid file type. Only JPEG, PNG, and GIF are allowed.',
            ),
            false,
          );
        }
      },
    }),
  )
  @Roles('admin')
  async create(
    @Body() createPharmacyDto: CreatePharmacyDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('File upload failed.');
    }

    const fileUrl = `http://localhost:3000/images/${file.filename}`;
    const fileUrlMobile = `http://10.0.2.2:3000/images/${file.filename}`;

    console.log(fileUrl);
    createPharmacyDto.image = fileUrl;
    createPharmacyDto.imageMobile = fileUrlMobile;

    const pharmacy =
      await this.pharmacyService.createPharmacy(createPharmacyDto);

    return { message: 'Pharmacy created successfully!', data: pharmacy };
  }

  // Get all pharmacies
  @Get()
  async findAll(): Promise<{ message: string; data: Pharmacy[] }> {
    const pharmacies = await this.pharmacyService.getAllPharmacies();
    return { message: 'Pharmacies retrieved successfully!', data: pharmacies };
  }

  // Get pharmcies OnGuard
  @Get('on-guard')
  async getPharmaciesOnGuard(): Promise<{
    message: string;
    data: Pharmacy[];
    count: number;
  }> {
    try {
      const pharmaciesOnGuard =
        await this.pharmacyService.getPharmaciesOnGuard();
      return {
        message: 'Pharmacies de garde récupérées avec succès',
        data: pharmaciesOnGuard,
        count: pharmaciesOnGuard.length,
      };
    } catch (error) {
      throw new BadRequestException({
        message: 'Erreur lors de la récupération des pharmacies de garde',
        error: error.message,
      });
    }
  }
  @Get('guard')
  async findGuardPharmacies(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
  ) {
    try {
      const result = await this.pharmacyService.findGuardPharmacies({
        latitude,
        longitude,
      });
      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to find guard pharmacies',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search')
  async searchPharmacies(
    @Query('query') query?: string,
    @Query('latitude', ParseFloatPipe) latitude?: number,
    @Query('longitude', ParseFloatPipe) longitude?: number,
    @Query('maxDistance', ParseIntPipe) maxDistance?: number,
  ) {
    return this.pharmacyService.searchPharmacies({
      query,
      latitude,
      longitude,
      maxDistance,
    });
  }

  // Get a pharmacy by ID
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Pharmacy }> {
    const pharmacy = await this.pharmacyService.getPharmacyById(id);
    if (!pharmacy) {
      return { message: 'Pharmacy not found!', data: null };
    }
    return { message: 'Pharmacy found!', data: pharmacy };
  }

  // Update a pharmacy by ID
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updatePharmacyDto: UpdatePharmacyDto,
  ): Promise<{ message: string; data: Pharmacy }> {
    const updatedPharmacy = await this.pharmacyService.updatePharmacy(
      id,
      updatePharmacyDto,
    );
    if (!updatedPharmacy) {
      return { message: 'Pharmacy not found or update failed!', data: null };
    }
    return { message: 'Pharmacy updated successfully!', data: updatedPharmacy };
  }

  // Delete a pharmacy by ID
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    console.log(id);

    const result = await this.pharmacyService.deletePharmacy(id);
    if (!result) {
      return { message: 'Pharmacy not found or deletion failed!' };
    }
    return { message: 'Pharmacy deleted successfully!' };
  }

  // Set a pharmacy as On Duty (Harcasa)
  @Patch(':id/set-on-duty')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async setOnDuty(
    @Param('id') id: string,
  ): Promise<{ message: string; data: Pharmacy }> {
    const pharmacy = await this.pharmacyService.setPharmacyOnDuty(id);
    if (!pharmacy) {
      return { message: 'Pharmacy not found or operation failed!', data: null };
    }
    return { message: 'Pharmacy set as On Duty successfully!', data: pharmacy };
  }

  @Get(':id')
  async getPharmacyById(@Param('id') id: string) {
    return await this.pharmacyService.getPharmacyById(id);
  }
}
