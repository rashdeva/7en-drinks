// src/combo/combo.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { Combo, ComboSchema } from './entity/combo.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Combo.name, schema: ComboSchema }]),
    ScheduleModule.forRoot(), // Enable the schedule module for the Cron jobs
    UsersModule,
  ],
  controllers: [ComboController],
  providers: [ComboService],
})
export class ComboModule {}
