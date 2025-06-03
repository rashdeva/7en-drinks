import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestDocument = Quest & Document;

@Schema({ timestamps: true })
export class Quest {
  _id: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  nameEn: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  descriptionEn: string;

  @Prop({
    required: true,
    enum: ['channel', 'link', 'inviteFriend', 'notifyFriend', 'drinkWater'],
  })
  type: 'channel' | 'link' | 'inviteFriend' | 'notifyFriend' | 'drinkWater';

  @Prop({ required: false })
  value?: string;

  @Prop({ required: false })
  sub_value?: string;

  @Prop({ required: true })
  tokens: number;

  @Prop({ default: false })
  completed: boolean;

  @Prop({ default: false })
  disabled: boolean;

  @Prop({ default: false })
  hidden: boolean;

  @Prop({ required: false })
  partner?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
