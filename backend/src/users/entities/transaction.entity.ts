import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.entity';

@Schema({
  timestamps: true,
})
export class Transaction extends Document {
  _id: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: string;

  @Prop({ required: true })
  type: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Quest',
    required: false,
    nullable: true
  })
  questid: string;

  @Prop({ required: true })
  amount: number;

  createdAt: Date;
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
