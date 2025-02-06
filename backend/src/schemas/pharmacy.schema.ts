import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Address, AddressSchema } from './address.schema';

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
}

export const PharmacySchema = SchemaFactory.createForClass(Pharmacy);
