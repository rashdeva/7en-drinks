// src/combo/combo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Combo } from './entity/combo.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ComboService {
  constructor(
    @InjectModel(Combo.name) private comboModel: Model<Combo>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Generate a random combination (3 random numbers from 0 to 9)
  private generateRandomCombination(): number[] {
    return [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];
  }

  // Save a new daily combination to the database
  async saveNewCombination(): Promise<Combo> {
    const combination = this.generateRandomCombination();
    const newCombo = new this.comboModel({ combination });
    return newCombo.save();
  }

  // Find today's combination
  async findTodayCombination(): Promise<Combo | null> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    const combo = await this.comboModel.findOne({
      createdAt: { $gte: startOfDay },
    });

    if (!combo?.combination) {
      await this.generateDailyCombo();
      return await this.comboModel.findOne({
        createdAt: { $gte: startOfDay },
      });
    }

    return combo;
  }

  // Check if user's combination matches today's combination
  async checkCombination(
    userCombo: number[],
    userId: string,
  ): Promise<boolean> {
    const todayCombo = await this.findTodayCombination();
    if (!todayCombo) {
      throw new Error('No combination found for today');
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has already passed today's combo
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const hasPassedToday = user.passed_combos.some(
      (record) => record.date >= startOfDay,
    );

    if (hasPassedToday) {
      throw new Error('You have already passed today’s combo.');
    }

    // Check if the submitted combination matches today’s combination
    const isValid =
      JSON.stringify(todayCombo.combination) === JSON.stringify(userCombo);

    if (isValid) {
      // User passed the combo successfully, increase balance by 500
      await this.userModel.findByIdAndUpdate(userId, {
        $inc: { balance: 500 }, // Increment balance by 500
        $push: { passed_combos: { date: new Date(), status: 'success', combination: todayCombo.combination } }, // Log success
      });
    } else {
      // User failed the combo, log the failure
      await this.userModel.findByIdAndUpdate(userId, {
        $push: { passed_combos: { date: new Date(), status: 'fail', combination: todayCombo.combination } }, // Log failure
      });
    }

    return isValid;
  }

  // Run this method every day at midnight (00:00) to generate a new combination
  @Cron('0 0 * * *')
  async generateDailyCombo(): Promise<void> {
    await this.saveNewCombination();
  }
}
