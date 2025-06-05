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
import { join } from 'path';
import { ComboModule } from './combo/combo.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { LocalesModule } from './locales/locales.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    MongoModule,
    AuthModule,
    NotificationModule,
    QuestModule,
    LocalesModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: join(__dirname, '/locales/'), // Points to dist/locales in production
        watch: false, // Disable watch in production environment
      },
    }),
    ComboModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
