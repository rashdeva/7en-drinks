import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationService } from 'src/notifications/notification.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { Quest } from './entities/quests.entity';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';

const lastRequestTimes = new Map<string, number>(); // Map to track request times per user

@Injectable()
export class QuestService {
  private readonly logger = new Logger(QuestService.name);

  constructor(
    @InjectModel(Quest.name) public readonly questModel: Model<Quest>,
    @InjectModel(User.name) public readonly userModel: Model<User>,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  async getAllQuests(): Promise<Quest[]> {
    return this.questModel.find().sort({ order: 1 }).exec();
  }

  async checkChannelQuest(quest: Quest, user: User) {
    const channelUsername = quest.value.toString().split('/').pop();
    let isMember = false;

    try {
      if (user.telegram.id) {
        const chatMember =
          await this.notificationService.bot.telegram.getChatMember(
            '@' + channelUsername,
            user.telegram.id,
          );

        isMember = ['member', 'administrator', 'creator'].includes(
          chatMember.status,
        );
      } else if (user.telegram.nickname) {
        const chatMember =
          await this.notificationService.bot.telegram.getChatMember(
            '@' + channelUsername,
            user.telegram.username,
          );
        isMember = ['member', 'administrator', 'creator'].includes(
          chatMember.status,
        );
      }

      if (isMember) {
        if (!user.quests.includes(quest._id)) {
          user.quests.push(quest._id);

          user.balance += quest.tokens;

          user.markModified('quests');
          await user.save();
          await this.usersService.addTransaction(user, quest.tokens, quest._id);
        }

        return {
          status: 'ok',
          id: quest._id,
          balance: user.balance,
        };
      } else {
        throw new BadRequestException('quest_error_not_join_channel');
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'quest_error_failed',
        error.status || 500,
      );
    }
  }

  async checkInviteFriendQuest(quest: Quest, user: User) {
    try {
      if (user.referrals.length >= Number(quest.value)) {
        if (!user.quests.includes(quest._id)) {
          user.quests.push(quest._id);

          user.balance += quest.tokens;

          user.markModified('quests');
          await user.save();
          await this.usersService.addTransaction(user, quest.tokens, quest._id);
        }

        return {
          status: 'ok',
          id: quest._id,
          balance: user.balance,
        };
      } else {
        throw new BadRequestException('quest_error_not_enough_friends');
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'task_error_failed',
        error.status,
      );
    }
  }

  async checkNotifyFriendQuest(quest: Quest, user: User) {
    try {
      const now = Date.now();
      const lastCompleted = user.quests_completed_timestamps?.[quest._id] || 0;
      const oneMinute = 60 * 1000;

      if (now - lastCompleted < oneMinute) {
        throw new BadRequestException('quest_error_time_not_elapsed');
      }

      // Update the balance and mark the quest as completed
      user.balance += quest.tokens;

      user.quests_completed_timestamps = {
        ...user.quests_completed_timestamps,
        [quest._id]: now,
      };

      user.markModified('questsCompletedTimestamps');
      await user.save();
      await this.usersService.addTransaction(user, quest.tokens, quest._id);

      return {
        status: 'ok',
        id: quest._id,
        balance: user.balance,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'quest_error_failed',
        error.status,
      );
    }
  }

  async addQuest(createQuestDto: CreateQuestDto): Promise<Quest> {
    const newQuest = new this.questModel(createQuestDto);
    return await newQuest.save();
  }

  async updateQuest(id: string, updateQuestDto: UpdateQuestDto) {
    const updatedQuest = await this.questModel.findByIdAndUpdate(
      id,
      updateQuestDto,
      { new: true },
    );
    if (!updatedQuest) {
      throw new NotFoundException(`Quest with ID ${id} not found`);
    }
    return updatedQuest;
  }
}
