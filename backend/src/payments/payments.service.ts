import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { Transaction } from '../users/entities/transaction.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { TonProviderService } from './ton-provider.service';
import { PaymentsGateway } from './payments.gateway';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @Inject(forwardRef(() => TonProviderService))
    private readonly tonProviderService: TonProviderService,
    private readonly paymentsGateway: PaymentsGateway,
  ) {}

  async initPayment(
    createPaymentDto: CreatePaymentDto,
    amount: number,
    user: User,
  ): Promise<Payment> {
    // Generate a unique order ID (using timestamp + user ID + random string)
    const randomStr = Math.random().toString(36).substring(2, 12);
    const orderId = `seven-daily-${user._id}-${randomStr}`;

    // Create a new payment record
    const payment = new this.paymentModel({
      orderId,
      amount,
      userAddress: createPaymentDto.userAddress,
      status: PaymentStatus.NEW,
      user: user._id,
    });

    // Save the payment to get an ID
    await payment.save();

    try {
      // Initialize payment with the selected provider
      const response = await this.tonProviderService.initPayment(
        payment.amount,
        payment.orderId,
        payment.userAddress,
      );

      // Update payment with provider's payment ID and URL
      payment.orderId = response.orderId;
      payment.userAddress = response.userAddress;
      payment.masterAddress = response.masterAddress;
      payment.amount = response.amount;

      await payment.save();

      this.logger.log(
        `Payment ${payment.orderId} initialized with TON provider, order ID: ${payment.orderId}`,
      );

      return payment;
    } catch (error) {
      payment.status = PaymentStatus.REJECTED;
      await payment.save();

      this.logger.error(
        `Error initializing payment ${payment.orderId}: ${error.message}`,
        error.stack,
      );

      throw new BadRequestException(
        `Failed to initialize payment: ${error.message}`,
      );
    }
  }

  async handleNotification(notificationDto: any): Promise<void> {
    try {
      if (!notificationDto.orderId) {
        throw new Error(`OrderId not found in notification`);
      }

      // Find the payment to get the user
      const existingPayment = await this.paymentModel
        .findOne({ orderId: notificationDto.orderId })
        .exec();
      if (!existingPayment) {
        throw new Error(
          `Payment with orderId ${notificationDto.orderId} not found`,
        );
      }

      // Handle notification with the selected provider
      const result =
        await this.tonProviderService.handleNotification(notificationDto);
      const resultOrderId = result.orderId;
      const status = result.status;

      // Find the payment by order ID (using the result orderId)
      const payment = await this.paymentModel
        .findOne({ orderId: resultOrderId })
        .exec();

      if (!payment) {
        throw new NotFoundException(
          `Payment with order ID ${resultOrderId} not found`,
        );
      }

      // Update payment status and data
      payment.status = status as PaymentStatus;

      await payment.save();

      this.logger.log(
        `Payment ${payment.orderId} status updated to ${status} based on TON notification`,
      );

      // Emit payment status update event
      this.paymentsGateway.notifyPaymentStatusUpdate(payment);

      // Handle successful or failed payment
      if (status === PaymentStatus.CONFIRMED) {
        await this.handlePaymentSuccess(payment.orderId);
      } else if (status === PaymentStatus.REJECTED) {
        await this.handlePaymentFailure(payment.orderId);
      }
    } catch (error) {
      this.logger.error(
        `Error handling payment notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Payment> {
    const payment = await this.paymentModel.findById(id).exec();
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async getUserPayments(userId: string): Promise<Payment[]> {
    return this.paymentModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Get a user's pending payment if it exists
   * @param userId User ID
   * @returns Pending payment or null
   */
  async getUserPendingPayment(userId: string): Promise<Payment | null> {
    return this.paymentModel
      .findOne({
        user: userId,
        createdAt: {
          // Check if the payment was created within the last 24 hours
          $gte: new Date(new Date().setDate(new Date().getDate() - 1)),
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Handle successful payment and create ticket or package
   * @param orderId Payment order ID
   */
  async handlePaymentSuccess(orderId: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ orderId }).exec();

    if (!payment) {
      throw new NotFoundException(`Payment with order ID ${orderId} not found`);
    }

    payment.status = PaymentStatus.CONFIRMED;
    this.paymentsGateway.notifyPaymentStatusUpdate(payment);
    await payment.save();

    this.logger.log(
      `Processing successful payment ${orderId} for user ${payment?.id}`,
    );

    await this.processDailyPayment(payment.user.toString());

    return payment;
  }

  /**
   * Process daily payment reward of 777 tokens for a user
   * User can only claim this reward once per day
   * @param userId User ID
   * @returns Updated user with new balance
   */
  async processDailyPayment(userId: string): Promise<User> {
    // Find the user
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if user has already claimed daily payment today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if there's a transaction of type 'daily_payment' for this user today
    const existingPayment = await this.transactionModel
      .findOne({
        user: userId,
        type: 'daily_payment',
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();

    if (existingPayment) {
      throw new ForbiddenException('Daily payment already claimed today');
    }

    // Add 777 to user balance and update lastDailyPayment
    user.balance += 777;
    user.lastCheckIn = new Date();
    await user.save();

    // Create transaction record
    const transaction = new this.transactionModel({
      user: userId,
      type: 'daily_payment',
      amount: 777,
    });
    await transaction.save();

    this.logger.log(`Daily payment of 777 processed for user ${userId}`);

    return user;
  }

  /**
   * Handle failed payment
   * @param orderId Payment order ID
   */
  async handlePaymentFailure(orderId: string): Promise<Payment> {
    const payment = await this.paymentModel.findOne({ orderId }).exec();

    if (!payment) {
      throw new NotFoundException(`Payment with order ID ${orderId} not found`);
    }

    // Only update if payment is not already in a final state
    if (
      payment.status !== PaymentStatus.CONFIRMED &&
      payment.status !== PaymentStatus.CANCELED &&
      payment.status !== PaymentStatus.REJECTED
    ) {
      // Update payment status
      payment.status = PaymentStatus.REJECTED;
      await payment.save();

      this.logger.log(`Payment ${orderId} marked as rejected`);
    }

    return payment;
  }
}
