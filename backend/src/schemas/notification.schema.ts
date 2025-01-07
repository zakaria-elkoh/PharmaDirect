import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Pharmacy } from './pharmacy.schema';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  userId: User;

  @Prop({ type: String, ref: 'Pharmacy' })
  pharmacyId: Pharmacy;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
