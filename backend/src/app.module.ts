import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { AuthModule } from './auth/auth.module';
import { NotificationModule } from './notifications/notification.module';
import { QuestModule } from './quests/quest.module';
import { ComboModule } from './combo/combo.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
// import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    MongoModule,
    AuthModule,
    NotificationModule,
    QuestModule,
    ComboModule,
    LeaderboardModule,
    // PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
