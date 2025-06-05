import { AuthService } from './auth/auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtAuthGuard } from './auth/auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from './users/entities/user.entity';
import {
  CheckProofPayload,
  CheckTonProof,
  GenerateTonProofPayload,
} from './auth/dto/tonproof';
import { checkProof, generatePayload } from './auth/guards/ton-proof';
import { Telegraf } from 'telegraf';
import { NotificationService } from './notifications/notification.service';
import { BubbleGameTokenGuard } from './auth/guards/bubble.guard';

const MAX_DRINKS = 7;
const lastRequestTimes = new Map<string, number>(); // Map to track request times per user

@UseGuards(JwtAuthGuard)
@Controller('api')
export class AppController {
  private bot: Telegraf;

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
  ) {
    this.notificationService.launch();
  }

  @Get('health-check')
  async healthCheck() {
    return {
      status: 'ok',
      code: 204,
    };
  }

  @Get('events')
  async getEvents() {
    return [];
  }

  @Post('generate-payload')
  generatePayload(): GenerateTonProofPayload {
    return generatePayload();
  }

  @Post('check-proof')
  async checkProof(
    @Body() checkProofPayload: CheckProofPayload,
  ): Promise<CheckTonProof> {
    return await checkProof(checkProofPayload);
  }

  @Post('drink/cup')
  async drinkCup(@CurrentUser() user: User): Promise<any> {
    const currentDate = new Date();
    const lastDrinkTime = user.last_drink_time;

    // Check if a new day has started
    const isNewDay =
      !lastDrinkTime ||
      lastDrinkTime?.toDateString() !== currentDate?.toDateString();

    // Reset drink count if it's a new day
    if (isNewDay) {
      user.drink_count = 0;
    } else {
      // Ensure user has not drunk more than MAX_DRINKS times today
      if (user.drink_count >= MAX_DRINKS) {
        throw new BadRequestException('drink_daily_limit');
      }

      // Check delay conditions based on drink count
      if (lastDrinkTime) {
        const timeSinceLastDrink =
          Math.abs(currentDate.getTime() - lastDrinkTime.getTime()) / 36e5;

        // For the 3rd and 4th drinks, ensure at least 2 hours have passed
        if (user.drink_count >= 2 && timeSinceLastDrink < 2) {
          throw new BadRequestException('drink_hour_limit');
        }
      }
    }

    // Add the current drink to the drinks array
    user.drinks.push(currentDate);

    // Update user drink count, last drink time, and balance
    user.drink_count += 1;
    user.total_drink += 1;
    user.last_drink_time = currentDate;
    user.balance += 1;

    // Add +100 if 4 drinks are completed in a day
    if (user.drink_count === MAX_DRINKS) {
      user.balance += 7;
    }

    await user.save();

    return {
      status: 'ok',
      drink_count: user.drink_count,
      last_drink_time: user.last_drink_time
        ? new Date(user.last_drink_time)
        : undefined,
      balance: user.balance,
      drinks: user.drinks,
    };
  }

  @UseGuards(BubbleGameTokenGuard)
  @Post('drink/drop')
  async handleDropTap(
    @Body() { amount }: { amount: number },
    @CurrentUser() user: User,
  ): Promise<any> {
    const userId = user._id;
    const currentTime = Date.now();

    // Check if the user has made a request within the last 5 seconds (5000 ms)
    if (lastRequestTimes.has(userId)) {
      const lastRequestTime = lastRequestTimes.get(userId);
      if (lastRequestTime && currentTime - lastRequestTime < 5000) {
        throw new Error('Too many requests. Please wait before trying again.');
      }
    }

    if (amount > 50) {
      throw new Error('Too many amount at one time');
    }

    // Update the last request time for this user
    lastRequestTimes.set(userId, currentTime);

    user.balance += amount;
    await user.save();

    const token = this.authService.createBubbleGameToken(user._id.toString());

    return {
      status: 'ok',
      balance: user.balance,
      token,
    };
  }
}
