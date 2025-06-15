import { AuthService } from './auth/auth.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from './users/entities/user.entity';
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

  @Post('drink/cup')
  async drinkCup(@CurrentUser() user: User): Promise<any> {
    const currentDate = new Date();
    const lastDrinkTime = user.last_drink_time;

    // get Drinks from the past hour
    const oneHourAgo = new Date(currentDate.getTime() - 60 * 60 * 1000);
    const drinksInLastHour = user.drinks.filter(
      (drinkTime) => new Date(drinkTime) > oneHourAgo,
    );

    // Check if user has already had 7 drinks in the past hour
    if (drinksInLastHour.length >= MAX_DRINKS) {
      throw new BadRequestException('drink_hourly_limit');
    }

    // Check if a new day has started
    const isNewDay =
      !lastDrinkTime ||
      lastDrinkTime?.toDateString() !== currentDate?.toDateString();

    // Reset daily drink count if it's a new day
    if (isNewDay) {
      user.drink_count = 0;
    }

    // Add the current drink to the drinks array
    user.drinks.push(currentDate);

    // Update user drink count, last drink time, and balance
    user.drink_count += 1;
    user.total_drink += 1;
    user.last_drink_time = currentDate;
    user.balance += 1;

    // Add bonus points if all 7 drinks are completed in an hour
    if (drinksInLastHour.length + 1 === MAX_DRINKS) {
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
