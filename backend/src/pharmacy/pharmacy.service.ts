import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pharmacy } from './schema/pharmacy.schema';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectModel(Pharmacy.name) private pharmacyModel: Model<Pharmacy>,
  ) {}

  async findGuardPharmacies(params: {
    latitude: number;
    longitude: number;
    date?: Date;
    maxDistance?: number;
  }) {
    const {
      latitude,
      longitude,
      date = new Date(),
      maxDistance = 10000,
    } = params;

    // Création du point GeoJSON avec le type littéral "Point"
    const point = {
      type: 'Point' as const,
      coordinates: [longitude, latitude] as [number, number],
    };

    const day = date
      .toLocaleDateString('fr-FR', { weekday: 'long' })
      .toLowerCase();

    return this.pharmacyModel.aggregate([
      {
        $geoNear: {
          near: point,
          distanceField: 'distance',
          maxDistance,
          spherical: true,
        },
      },
      {
        $match: {
          isOnGard: true,
          'openingHours.day': day,
        },
      },
      {
        $addFields: {
          openingHours: {
            $filter: {
              input: '$openingHours',
              as: 'hour',
              cond: { $eq: ['$$hour.day', day] },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          phone: 1,
          distance: 1,
          openingHours: { $arrayElemAt: ['$openingHours', 0] },
          isOnGard: 1,
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);
  }

  async getPharmacyDetails(id: string) {
    return this.pharmacyModel.findById(id).exec();
  }

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
}
