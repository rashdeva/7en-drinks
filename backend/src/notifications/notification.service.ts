import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Telegraf } from 'telegraf';
import { I18nService } from 'nestjs-i18n';
import { Cron } from '@nestjs/schedule';
import Bottleneck from 'bottleneck';

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

  constructor(
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {
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
        if (startPayload) {
          if (!user) {
            user = new this.usersService.userModel({
              id: ctx.from.id,
              first_name: ctx.from.first_name,
              last_name: ctx.from.last_name,
              username: ctx.from.username,
              language_code: ctx.from.language_code,
              telegram: ctx.from,
              is_premium: ctx.from.is_premium,
              notifications: ['start'],
              balance: 10,
            });
            await user.save();
          }
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

    const startButtonText = this.i18n.t('translation.start_button_text', {
      lang: userLang,
    });
    const subscribeChannelText = this.i18n.t('translation.subscribe_channel', {
      lang: userLang,
    });
    const welcomeMessageText = this.i18n.t('translation.welcome_message', {
      lang: userLang,
    });

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
            url: 'https://t.me/habbit_hero',
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
      // Use the rate limiter when sending the welcome message
      await this.limiter.schedule(() =>
        this.bot.telegram.sendMessage(id, welcomeMessageText, {
          parse_mode: 'Markdown',
          reply_markup: markup,
        }),
      );
    } catch (error) {
      console.error(`Failed to send start message to user ${id}:`, error);
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
    let notificationText = '';
    const userLang = user.language_code || 'en';
    const botName = this.botName;

    const startButtonText = this.i18n.t('translation.start_drink_water', {
      lang: userLang,
    });

    let markup = {
      inline_keyboard: [
        [
          {
            text: startButtonText,
            url: `https://t.me/${botName}/onboarding?startapp=utm_${type}`,
          },
        ],
      ],
    };

    switch (type) {
      case 'retention_24h':
        notificationText = this.i18n.t('translation.notification_24h', {
          lang: userLang,
        });
        break;
      case 'retention_48h':
        notificationText = this.i18n.t('translation.notification_48h', {
          lang: userLang,
        });
        break;
      case 'retention_7d':
        notificationText = this.i18n.t('translation.notification_7d', {
          lang: userLang,
        });
        break;
    }

    try {
      return this.bot.telegram.sendMessage(user.id, notificationText, {
        parse_mode: 'Markdown',
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
