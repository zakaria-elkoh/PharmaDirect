import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  ParseFloatPipe,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { PharmacyService } from './pharmacy.service';

@Controller('pharmacy')
export class PharmacyController {
  constructor(private readonly pharmacyService: PharmacyService) {}

  @Get('guard')
  async findGuardPharmacies(
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('date') date?: string,
    @Query('maxDistance', ParseIntPipe) maxDistance?: number,
  ) {
    return this.pharmacyService.findGuardPharmacies({
      latitude,
      longitude,
      date: date ? new Date(date) : undefined,
      maxDistance,
    });
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

  @Get(':id')
  async getPharmacyDetails(@Param('id') id: string) {
    return this.pharmacyService.getPharmacyDetails(id);
  }

  @Get()
  async getPharmacies() {
    return this.pharmacyService.getAllPharmacies();
  }

}
