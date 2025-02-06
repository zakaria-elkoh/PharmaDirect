import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type PharmacyDocument = HydratedDocument<Pharmacy>;

@Schema({ timestamps: true })
export class Pharmacy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  imageMobile: string;

  @Prop({ required: true })
  latitude: number; // Latitude from Google Maps

  @Prop({ required: true })
  longitude: number; // Longitude from Google Maps

  @Prop({ required: true })
  detailedAddress: string; // Full address fetched from Google Maps API

  @Prop({ required: true, unique: true })
  email: string; // Email address of the pharmacy

  @Prop({ required: true, default: false })
  isOnDuty: boolean; // Indicates if the pharmacy is on duty

  @Prop({ required: false })
  description?: string; // Optional description for the pharmacy

  @Prop({ default: false })
  isOnGard: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: [number, number];
  };
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);
// Index géospatial pour les recherches de proximité
PharmacySchema.index({ location: '2dsphere' });

// Index pour améliorer les performances des recherches
PharmacySchema.index({ isOnGard: 1 });
PharmacySchema.index({ name: 1 });
PharmacySchema.index({ city: 1 });

// Middleware pre-save pour mettre à jour automatiquement le champ location
PharmacySchema.pre('save', function(next) {
  if (this.latitude && this.longitude) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude] // MongoDB utilise [longitude, latitude]
    };
  }
  next();
});
