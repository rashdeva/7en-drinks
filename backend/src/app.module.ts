import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notifications/notification.module';
import { QuestModule } from './quests/quest.module';
import { I18nModule } from 'nestjs-i18n';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ComboModule } from './combo/combo.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { BubbleGameTokenGuard } from './auth/guards/bubble.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    MongoModule,
    AuthModule,
    NotificationModule,
    QuestModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '../../shared/locales'),
        watch: true, // Enable hot-reload for translation files
      },
    }),
    ComboModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

