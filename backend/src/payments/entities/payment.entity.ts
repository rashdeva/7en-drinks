import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export enum PaymentStatus {
  NEW = 'NEW',
  AUTHORIZED = 'AUTHORIZED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  REJECTED = 'REJECTED',
  REFUNDED = 'REFUNDED',
  PARTIAL_REFUNDED = 'PARTIAL_REFUNDED',
  PENDING = 'PENDING',
}

@Schema({
  timestamps: true,
})
export class Payment extends Document {
  _id: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentStatus, default: PaymentStatus.NEW })
  status: PaymentStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: false })
  masterAddress?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  userAddress?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
