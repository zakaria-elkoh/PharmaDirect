import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { Address, AddressSchema } from './address.schema';

export type PharmacyDocument = HydratedDocument<Pharmacy>;

@Schema({ timestamps: true })
export class Pharmacy extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: AddressSchema, required: true })
  address: Address;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;

  @Prop([
    {
      day: { type: String, required: true },
      open: { type: String, required: true },
      close: { type: String, required: true },
    },
  ])
  openingHours: Array<{ day: string; open: string; close: string }>;

  @Prop([String])
  services: string[];

  @Prop([String])
  images: string[];

  @Prop({ default: false })
  isOnGard: boolean;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);

// Create a single 2dsphere index
PharmacySchema.index({ location: '2dsphere' });
