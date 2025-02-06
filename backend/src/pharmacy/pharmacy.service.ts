import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePharmacyDto } from './dto/createPharmacy';
import { Pharmacy } from 'src/schemas/pharmacy.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PipelineStage } from 'mongoose';
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
    console.log(checkPharmacy);
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

  // search for pharmacies onGuard
  async findGuardPharmacies(params: {
    latitude: number;
    longitude: number;
  }) {
    try {
      // Trouver toutes les pharmacies de garde
      const pharmacies = await this.pharmacyModel.find({
        isOnGard: true
      }).exec();

      // Ajouter la distance pour chaque pharmacie
      const pharmaciesWithDistance = pharmacies.map(pharmacy => {
        const distance = this.calculateDistance(
          params.latitude,
          params.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );

        return {
          ...pharmacy.toObject(),
          distance: Math.round(distance * 1000) // Convertir en mètres
        };
      });

      // Trier par distance
      pharmaciesWithDistance.sort((a, b) => a.distance - b.distance);

      return {
        success: true,
        data: pharmaciesWithDistance,
        count: pharmaciesWithDistance.length
      };

    } catch (error) {
      console.error('Error finding guard pharmacies:', error);
      throw error;
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance en km
  }

  // Get pharmacy details
  async getPharmacyDetails(id: string) {
    return this.pharmacyModel.findById(id).exec();
  }

  // Search for pharmacies by distance
  async searchPharmacies(params: {
    query?: string;
    latitude?: number;
    longitude?: number;
    maxDistance?: number;
  }) {
    const { query, latitude, longitude, maxDistance = 10000 } = params;

    let aggregation: any[] = [];

    if (latitude && longitude) {
      const point = {
        type: 'Point' as const,
        coordinates: [longitude, latitude] as [number, number],
      };

      aggregation.push({
        $geoNear: {
          near: point,
          distanceField: 'distance',
          maxDistance,
          spherical: true,
        },
      });
    }

    if (query) {
      aggregation.push({
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { 'address.street': { $regex: query, $options: 'i' } },
            { 'address.city': { $regex: query, $options: 'i' } },
            { services: { $regex: query, $options: 'i' } },
          ],
        },
      });
    }

    // Si aucun critère n'est fourni, retourner toutes les pharmacies
    if (aggregation.length === 0) {
      return this.pharmacyModel.find().exec();
    }

    return this.pharmacyModel.aggregate(aggregation);
  }

  // get pharmcies OnGuard
  async getPharmaciesOnGuard(): Promise<Pharmacy[]> {
    try {
      const pharmaciesOnGuard = await this.pharmacyModel
        .find({
          isOnGard: true,
        })
        .exec();

      return pharmaciesOnGuard;
    } catch (error) {
      throw new Error(`Failed to fetch pharmacies on guard: ${error.message}`);
    }
  }
}
