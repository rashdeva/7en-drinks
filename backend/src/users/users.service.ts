import {
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InitData } from '../auth/auth.utils';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) public readonly userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async addTransaction(user, amount, questId = null, type = 'quest_complete') {
    const newTransaction = new this.transactionModel({
      user: user._id,
      questId,
      amount,
      type,
    });
    return await newTransaction.save();
  }

  findOneById(id: any) {
    return this.userModel
      .findOne({ _id: id })
      .populate([
        {
          path: 'referrals',
          select: '_id first_name last_name username balance',
        },
      ])
      .exec();
  }

  findOne(params: any) {
    return this.userModel.findOne(params).exec();
  }

  find(params: any, params2 = null) {
    return this.userModel.find(params, params2).exec();
  }

  async findOrCreateTelegramUser(initData: InitData) {
    let user = await this.userModel
      .findOne({ id: initData.user.id })
      .populate([
        {
          path: 'referrals',
          select: '_id first_name last_name username balance',
        },
      ])
      .exec();
    if (user) {
      return user;
    }

    const newUser = new this.userModel({
      id: initData.user.id,
      first_name: initData.user.first_name,
      last_name: initData.user.last_name,
      username: initData.user.username,
      language_code: initData.user.language_code,
      telegram: initData.user,
      is_premium: initData.user.is_premium,
      is_registered: false,
    });
    user = await newUser.save();
    return this.userModel.findById(user._id).exec();
  }

  async addAmbasador(userId: string) {
    try {
      await this.userModel.updateOne(
        { _id: userId },
        {
          $set: { is_ambasador: true },
        },
      );
    } catch (error) {}
  }

  async addReferral(referrerId: string, referralId: string) {
    try {
      const referrer = await this.userModel.findOne({ id: referrerId }).exec();
      if (!referrer) throw new NotFoundException();

      const referral = await this.userModel
        .findOne({
          _id: referralId,
          referrer_id: null,
          createdAt: {
            $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
          },
        })
        .exec();

      if (!referral) throw new NotFoundException();

      if (referrer.id == referral.id) throw new NotFoundException();

      if (!referrer.referrals) {
        referrer.referrals = [referralId];
      } else {
        referrer.referrals.push(referralId);
      }

      await this.userModel.updateOne(
        { id: referrerId },
        {
          $set: { referrals: referrer.referrals },
          $inc: { balance: 7 },
        },
      );

      await this.userModel.updateOne(
        { _id: referralId },
        {
          $set: { referrer_id: referrerId },
          $inc: { balance: 7 },
        },
      );

      return await this.userModel.findOne({ id: referrerId }).exec();
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(id: string) {
    try {
      const user = await this.userModel.findOne({ id: id }).exec();
      if (!user) throw new UnauthorizedException();
      return user;
    } catch (e) {
      console.error(e);
    }
  }

  async completeOnboarding(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) throw new UnauthorizedException();
    if (user.is_onboarded) {
      throw new ForbiddenException('User is already onboarded');
    }

    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          is_onboarded: true,
        },
        { new: true },
      )
      .exec();
  }

  async updateLastVisit(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { lastVisit: new Date() });
  }

  async findInactiveUsers(
    currentDate: Date,
    hours: number,
    excludeIds: string[] = [],
  ): Promise<User[]> {
    const targetDate = new Date(currentDate);
    targetDate.setHours(targetDate.getHours() - hours);

    return this.userModel
      .find({
        $or: [
          { lastVisit: { $lt: targetDate } },
          { lastVisit: { $exists: false } },
        ],
        _id: { $nin: excludeIds },
      })
      .exec();
  }

  async addNotification(userId: string, type: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $push: {
          notifications: {
            type,
            timestamp: new Date(),
            read: false,
          },
        },
      },
      { new: true },
    );
  }

  async clearRetentionNotifications(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          notifications: { type: { $regex: '^retention_' } },
        },
      },
      { new: true },
    );
  }
}
