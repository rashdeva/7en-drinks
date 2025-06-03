import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export class User extends Document {
  _id: string;

  @Prop({ required: false })
  id: number;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: false })
  last_name: string;

  @Prop({ required: false })
  username: string;

  @Prop({ required: false })
  language_code: string;

  @Prop({ required: false })
  ton_address: string;

  @Prop({ required: false })
  photo_url: string;

  @Prop({ required: false })
  is_premium: boolean;

  @Prop({ required: false, default: false })
  is_onboarded: boolean;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  telegram: any;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  preferences?: any;

  @Prop({ default: 0 })
  balance: number;

  @Prop({ required: false, nullable: true })
  referrer_id: string;

  @Prop({ required: false, nullable: true })
  referrals_count: number;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'User', default: [] }],
    required: false,
  })
  referrals: string[];

  @Prop({ required: false, nullable: true })
  wallet: string;

  @Prop({ required: false, nullable: true })
  avatar: string;

  @Prop({ type: SchemaTypes.Date, required: false })
  birthday: Date;

  @Prop({ required: false })
  is_verified: boolean;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: 'Quest', default: [] }],
    required: false,
  })
  quests: string[];

  @Prop({ required: false, default: 0 })
  drink_count: number;

  @Prop({ required: false, default: 0 })
  total_drink: number;

  @Prop({ required: false, nullable: true })
  last_drink_time: Date | null;

  @Prop({ type: SchemaTypes.Array, required: false, default: [] })
  drinks: Array<Date>;

  @Prop({
    type: [
      {
        type: {
          type: String, // Type of notification (e.g., 'retention_24h', 'retention_48h', 'retention_7d')
          required: true,
        },
        timestamp: {
          type: Date, // When the notification was sent
          required: true,
        },
        read: {
          type: Boolean, // Whether the notification was "processed" or "cleared"
          default: false,
        },
      },
    ],
    default: [],
  })
  notifications: {
    type: string;
    timestamp: Date;
    read: boolean;
  }[];

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ type: SchemaTypes.Mixed, required: false, default: {} })
  quests_completed_timestamps: Record<string, number>; // Added field for quest timestamps

  @Prop({
    type: [
      {
        date: { type: Date, required: true },
        status: { type: String, enum: ['success', 'fail'], required: true },
        combination: { type: SchemaTypes.Array, required: false },
      },
    ],
    default: [],
  })
  passed_combos: {
    date: Date;
    status: 'success' | 'fail';
    combination: number[];
  }[];

  @Prop({ type: Date, default: Date.now })
  lastVisit: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
