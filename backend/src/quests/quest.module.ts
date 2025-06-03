import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestController } from './quest.controller';
import { Quest, QuestSchema } from './entities/quests.entity';
import { HttpModule } from '@nestjs/axios';
import { UsersModule } from '../users/users.module';
import { QuestService } from './quest.service';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quest.name, schema: QuestSchema }]),
    HttpModule,
    forwardRef(() => UsersModule),
    forwardRef(() => NotificationModule),
  ],
  controllers: [QuestController],
  providers: [QuestService],
})
export class QuestModule {}
