import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => UsersModule), // Use forwardRef to handle circular dependency
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
