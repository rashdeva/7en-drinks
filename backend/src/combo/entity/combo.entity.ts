import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Combo extends Document {
  @Prop({ required: true, type: [Number] })
  combination: number[];

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const ComboSchema = SchemaFactory.createForClass(Combo);
