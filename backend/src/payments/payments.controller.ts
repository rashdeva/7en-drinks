import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Payment } from './entities/payment.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

const AMOUNT = 0.2;

@Controller('api/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check-in')
  async initPayment(
    @Body() createPaymentDto: CreatePaymentDto,
    @CurrentUser() user,
  ): Promise<Payment> {
    // Check if 24 hours have passed since the last daily payment
    if (user.lastDailyPayment) {
      const lastPaymentTime = new Date(user.lastDailyPayment).getTime();
      const currentTime = new Date().getTime();
      const hoursPassed = (currentTime - lastPaymentTime) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        throw new Error('You can only claim daily payment once every 24 hours');
      }
    }

    // Check if user already has a pending payment
    const pendingPayment = await this.paymentsService.getUserPendingPayment(
      user._id,
    );

    if (pendingPayment) {
      // Return the existing pending payment
      return pendingPayment;
    }

    // Create a new payment if no pending payment exists
    return this.paymentsService.initPayment(createPaymentDto, AMOUNT, user);
  }

  @Post('notification')
  @HttpCode(200)
  async handleGenericNotification(
    @Body() notificationDto: any,
  ): Promise<{ success: boolean }> {
    await this.paymentsService.handleNotification(notificationDto);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserPayments(@Req() req): Promise<Payment[]> {
    return this.paymentsService.getUserPayments(req.user._id);
  }

  @Get('success')
  async handlePaymentSuccess(@Query('orderId') orderId: string): Promise<void> {
    await this.paymentsService.handlePaymentSuccess(orderId);
  }

  @Get('failure')
  async handlePaymentFailure(@Query('orderId') orderId: string): Promise<void> {
    await this.paymentsService.handlePaymentFailure(orderId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('ton/initiated')
  @HttpCode(200)
  async updateTonPaymentInitiated(
    @Body() payload: { orderId: string },
  ): Promise<{ success: boolean }> {
    await this.paymentsService.handleNotification(payload);
    return { success: true };
  }
}
