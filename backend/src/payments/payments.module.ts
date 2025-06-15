import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './entities/payment.entity';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from '../users/entities/user.entity';
import { TonProviderService } from './ton-provider.service';
import {
  Transaction,
  TransactionSchema,
} from 'src/users/entities/transaction.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, TonProviderService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
