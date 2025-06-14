import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Telegraf } from 'telegraf';
// import { join } from 'path'; // No longer needed
import { formatTelegramMessage } from '../utils/telegram-utils';
import {
  WELCOME_IMAGE_BASE64,
  DRINK_IMAGE_BASE64,
} from '../utils/image-constants';
import { Cron } from '@nestjs/schedule';
import Bottleneck from 'bottleneck';
import { getNotificationMessage } from './notification.messages';

@Injectable()
export class NotificationService {
  public bot: Telegraf;
  private botName: string;
  private limiter: Bottleneck;

  launch() {
    try {
      this.bot.launch();
    } catch (e) {
      console.log(e);
    }
  }

  constructor(private readonly usersService: UsersService) {
    this.limiter = new Bottleneck({
      minTime: 50,
      maxConcurrent: 1,
    });

    this.bot = new Telegraf(process.env.BOT_TOKEN, {
      handlerTimeout: Infinity,
    });

    this.bot.catch((error) => {
      console.log(error);
    });

    this.botName = process.env.BOT_NAME;

    this.bot.start(async (ctx) => {
      const userLang = ctx.from.language_code || 'en';
      const startPayload = ctx.message.text.split(' ')[1];

      try {
        let user = await this.usersService.findOne({ id: ctx.from.id });

        if (!user) {
          user = new this.usersService.userModel({
            id: ctx.from.id,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name,
            username: ctx.from.username,
            language_code: ctx.from.language_code,
            telegram: ctx.from,
            is_premium: ctx.from.is_premium,
            notifications: [
              {
                type: 'start',
                timestamp: new Date(),
                read: true,
              },
            ],
            balance: 7,
          });
          await user.save();
        }

        if (startPayload) {
          try {
            if (startPayload.startsWith('ambasador')) {
              await this.usersService.addAmbasador(ctx.from.id.toString());
            } else if (Number(startPayload)) {
              await this.usersService.addReferral(startPayload, user._id);
            } else {
              console.log('payload:', startPayload);
            }
          } catch (error) {
            console.error('Error processing start payload', error);
          }
        }

        await this.sendStartMessage(userLang, ctx.from.id);
      } catch (error) {
        console.error('Error in bot start', error);
      }
    });
  }

  public async sendStartMessage(
    userLang: string,
    id: number,
    isReferral = false,
  ) {
    const botName = this.botName;

    // Use constants instead of i18n
    const startButtonText = getNotificationMessage(
      'start_button_text',
      userLang,
    );
    const subscribeChannelText = getNotificationMessage(
      'subscribe_channel',
      userLang,
    );
    let welcomeMessageText = getNotificationMessage('welcome', userLang);

    // Escape special characters for MarkdownV2
    welcomeMessageText = formatTelegramMessage(
      welcomeMessageText.replace(/\*/g, '*'),
    );

    let markup = {
      inline_keyboard: [
        [
          {
            text: startButtonText,
            url: `https://t.me/${botName}/onboarding`,
          },
        ],
        [
          {
            text: subscribeChannelText,
            url: 'https://t.me/se7en_meme',
          },
        ],
      ],
    };
    if (isReferral) {
      markup = {
        inline_keyboard: [
          [
            {
              text: startButtonText,
              url: `https://t.me/${this.botName}/onboarding?startapp=${id}`,
            },
          ],
        ],
      };
    }

    try {
      await this.limiter.schedule(() =>
        this.bot.telegram.sendPhoto(
          id,
          { source: Buffer.from(WELCOME_IMAGE_BASE64.split(',')[1], 'base64') },
          {
            caption: welcomeMessageText,
            parse_mode: 'MarkdownV2',
            reply_markup: markup,
          },
        ),
      );
    } catch (error) {
      console.error(`Failed to send start message to user ${id}:`, error);
      // If sending with photo fails, try sending just the message as fallback
      try {
        await this.limiter.schedule(() =>
          this.bot.telegram.sendMessage(id, welcomeMessageText, {
            parse_mode: 'MarkdownV2',
            reply_markup: markup,
          }),
        );
      } catch (fallbackError) {
        console.error(
          `Failed to send fallback message to user ${id}:`,
          fallbackError,
        );
      }
    }
  }

  @Cron('0 * * * *')
  async checkInactiveUsers() {
    const now = new Date();

    const users7d = await this.usersService.findInactiveUsers(now, 168);
    await this.sendRetentionNotifications(users7d, 'retention_7d');

    const exclude7d = users7d.map((user) => user._id);
    const users48h = await this.usersService.findInactiveUsers(
      now,
      48,
      exclude7d,
    );
    await this.sendRetentionNotifications(users48h, 'retention_48h');

    const exclude48h = [...exclude7d, ...users48h.map((user) => user._id)];
    const users24h = await this.usersService.findInactiveUsers(
      now,
      24,
      exclude48h,
    );
    await this.sendRetentionNotifications(users24h, 'retention_24h');
  }

  private async sendRetentionNotifications(users: any[], type: string) {
    for (const user of users) {
      const alreadyNotified = user.notifications?.find(
        (n) => n.type === type && !n.read,
      );

      try {
        if (!alreadyNotified) {
          await this.limiter.schedule(() => this.sendNotification(user, type));
          await this.usersService.addNotification(user._id, type);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  private async sendNotification(user: any, type: string) {
    const userLang = user.language_code || 'en';
    const botName = this.botName;

    // Use constants instead of i18n
    const startButtonText = getNotificationMessage(
      'start_drink_water',
      userLang,
    );

    const markup = {
      inline_keyboard: [
        [
          {
            text: startButtonText,
            url: `https://t.me/${botName}/onboarding?startapp=utm_${type}`,
          },
        ],
      ],
    };

    const notificationText = getNotificationMessage(type as any, userLang);
    const formattedText = formatTelegramMessage(
      notificationText.replace(/\*/g, '*'),
    );

    try {
      this.bot.telegram.sendPhoto(
        user.id,
        { source: Buffer.from(DRINK_IMAGE_BASE64.split(',')[1], 'base64') },
        {
          caption: formattedText,
          parse_mode: 'MarkdownV2',
          reply_markup: markup,
        },
      );
    } catch (error) {
      try {
        this.bot.telegram.sendMessage(user.id, formattedText, {
          parse_mode: 'MarkdownV2',
          reply_markup: markup,
        });
      } catch (error) {
        console.error(
          `Failed to send ${type} notification to user ${user.id}:`,
          error,
        );
      }
    }
  }
}
