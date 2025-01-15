import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePharmacyDto } from './dto/createPharmacy';
import { Pharmacy } from 'src/schemas/pharmacy.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PharmacyServices {
  constructor(
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
    
  ) {}

  // Create a new pharmacy
  async createPharmacy(data: CreatePharmacyDto): Promise<Pharmacy> {
    const checkPharmacy = await this.pharmacyModel.findOne({
      email: data.email,
    });
    console.log(checkPharmacy)
    if (checkPharmacy) {
      throw new HttpException(
        'Pharmacy with this email already exists.',
        HttpStatus.CONFLICT,
      );
    }
    const pharmacy = new this.pharmacyModel(data);
    console.log(pharmacy);
    
    return await pharmacy.save();
  }

  // Get all pharmacies
  async getAllPharmacies(): Promise<Pharmacy[]> {
    return await this.pharmacyModel.find().exec();
  }

  // Get a pharmacy by ID
  async getPharmacyById(id: string): Promise<Pharmacy> {
    return await this.pharmacyModel.findById(id).exec();
  }

  // Update pharmacy by ID
  async updatePharmacy(
    id: string,
    updateData: Partial<Pharmacy>,
  ): Promise<Pharmacy> {
    if (updateData.email) {
      const checkPharmacy = await this.pharmacyModel.findOne({
        email: updateData.email,
      });
      if (checkPharmacy) {
        throw new HttpException(
          'Pharmacy with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }
    }

    return await this.pharmacyModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  // Delete pharmacy by ID
  async deletePharmacy(id: string): Promise<boolean> {
    const result = await this.pharmacyModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // Set pharmacy as On Duty (Harcasa)
  async setPharmacyOnDuty(id: string): Promise<Pharmacy | null> {
    const pharmacy: any = await this.pharmacyModel.findById(id).exec();
    if (!pharmacy) {
      return null;
    }
    pharmacy.isOnDuty = true; // Setting the pharmacy as On Duty
    return await pharmacy.save();
  }
}
