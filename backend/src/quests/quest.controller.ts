import { UsersService } from '../users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../auth/auth.guard';
import { QuestService } from './quest.service';
import { Roles } from 'src/auth/auth.decorators';
import { CreateQuestDto } from './dto/create-quest.dto';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { UpdateQuestDto } from './dto/update-quest.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/quests')
export class QuestController {
  constructor(
    private readonly questService: QuestService,
    private readonly usersService: UsersService,
  ) {}

  @Post('')
  async getQuests(@CurrentUser() user: User) {
    const userModel = await this.usersService.findOneById(user._id);
    const quests = await this.questService.getAllQuests();

    quests.map((quest) => {
      if (userModel.quests.includes(quest._id)) {
        quest.completed = true;
      } else {
        quest.completed = false;
      }
    });

    return quests.sort((a, b) => {
      if (a.completed && !b.completed) {
        return 1;
      }
      if (!a.completed && b.completed) {
        return -1;
      }
      if (a.completed && b.completed) {
        return a.order - b.order;
      }
      return a.order - b.order;
    });
  }

  @Post('complete')
  async questsCompelete(@Body() body, @CurrentUser() user: User): Promise<any> {
    const quest = await this.questService.questModel
      .findOne({ _id: body.id })
      .exec();

    if (!quest) {
      throw new BadRequestException('quest_error_not_found');
    }

    if (quest.type === 'channel') {
      return await this.questService.checkChannelQuest(quest, user);
    }

    if (quest.type === 'inviteFriend') {
      return await this.questService.checkInviteFriendQuest(quest, user);
    }

    if (quest.type === 'notifyFriend') {
      return await this.questService.checkNotifyFriendQuest(quest, user);
    }

    if (!user.quests.includes(body.id)) {
      user.quests.push(body.id);
      user.balance += quest.tokens;

      user.markModified('quests');
      await user.save();
      await this.usersService.addTransaction(user, quest.tokens, body.id);
    } else {
      return {
        status: 'silent',
      };
    }

    return {
      status: 'ok',
      id: body.id,
      balance: user.balance,
      user,
    };
  }

  @Roles('admin')
  @Post('add')
  async addQuest(@Body() createQuestDto: CreateQuestDto) {
    return await this.questService.addQuest({
      ...createQuestDto,
      order: 1,
    });
  }

  @Roles('admin')
  @Put(':id')
  async updateQuest(
    @Param('id') id: string,
    @Body() updateQuestDto: UpdateQuestDto,
  ) {
    return await this.questService.updateQuest(id, updateQuestDto);
  }
}
