import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { PaymentsService } from './payments.service';

const TonWeb = require('tonweb');

@Injectable()
export class TonProviderService {
  private readonly logger = new Logger(TonProviderService.name);
  private tonweb: any;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Payment.name)
    private readonly paymentModel: Model<Payment>,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
  ) {
    // Initialize TonWeb only for the default instance
    // For instances created with specific user credentials, we'll initialize on demand
    this.initTonWeb();
  }

  /**
   * Initialize TonWeb client
   * This is extracted to a protected method so it can be safely called or skipped
   */
  protected initTonWeb(): void {
    try {
      // Only initialize if TonWeb is available
      if (typeof TonWeb !== 'undefined') {
        const apiKey = this.configService.get<string>('TONCENTER_API_KEY');
        const endpoint = 'https://toncenter.com/api/v2/jsonRPC';

        this.tonweb = new TonWeb(
          new TonWeb.HttpProvider(endpoint, {
            apiKey,
          }),
        );
      }
    } catch (error) {
      this.logger.error(
        `Error initializing TonWeb: ${error.message}`,
        error.stack,
      );
      // Don't throw - we'll check for this.tonweb before using it
    }
  }

  async initPayment(
    amount: number,
    orderId: string,
    userAddress?: string,
  ): Promise<{
    orderId: string;
    userAddress?: string;
    masterAddress?: string;
    amount?: number;
  }> {
    // Check if TonWeb is initialized
    if (!this.tonweb) {
      throw new Error(
        'TonWeb is not initialized. Missing configuration or TonWeb library.',
      );
    }

    try {
      const masterAddress = this.configService.get<string>(
        'TON_MASTER_ADDRESS',
        'UQAWnvwKk1AgUDsgt-gOnoVvT6TbAxxbgZ8OIJAU_CwUj871',
      );

      const nanoAmount = await this.convertToNanoTons(amount);

      return {
        orderId: orderId,
        userAddress: userAddress,
        masterAddress: masterAddress,
        amount: nanoAmount,
      };
    } catch (error) {
      this.logger.error(
        `Error initializing TON payment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async handleNotification(
    payload: Record<string, any>,
  ): Promise<{ orderId: string; status: string }> {
    try {
      // Extract orderId from payload
      const { orderId } = payload;

      if (!orderId) {
        throw new Error('Order ID is required in notification payload');
      }

      // Find the payment in the database to get the payment address and amount
      const payment = await this.paymentModel.findOne({ orderId }).exec();
      if (!payment) {
        throw new Error(`Payment with order ID ${orderId} not found`);
      }

      // Start polling for payment confirmation
      this.startPaymentConfirmationPolling(payment);

      return {
        orderId,
        status: PaymentStatus.PENDING,
      };
    } catch (error) {
      this.logger.error(
        `Error handling TON notification: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getPaymentStatus(payment: Payment): Promise<string> {
    return this.mapStatusToPaymentStatus(payment.status);
  }

  mapStatusToPaymentStatus(status: string): string {
    // Map TON-specific status to our PaymentStatus enum
    switch (status) {
      case 'success':
        return PaymentStatus.CONFIRMED;
      case 'failed':
        return PaymentStatus.REJECTED;
      case 'pending':
        return PaymentStatus.PENDING;
      default:
        return PaymentStatus.PENDING;
    }
  }

  /**
   * Check if a payment has been confirmed on the TON blockchain
   * @param payment Payment to check
   * @returns Object with confirmation status and transaction details
   */
  private async checkPaymentOnBlockchain(payment: Payment): Promise<{
    confirmed: boolean;
    transactionHash?: string;
    senderAddress?: string;
  }> {
    // Check if TonWeb is initialized
    if (!this.tonweb) {
      this.logger.error(
        'TonWeb is not initialized. Cannot check payment on blockchain.',
      );
      return { confirmed: false };
    }

    try {
      // Extract payment details from metadata
      const { masterAddress, amount } = payment;

      if (!masterAddress || !amount) {
        throw new Error(`Missing payment details for order ${payment.orderId}`);
      }

      // Get recent transactions for the payment address
      const transactions = await this.getTransactions(masterAddress, 10);

      // Check if any transaction matches our payment criteria
      for (const tx of transactions) {
        const result = this.matchTransaction(tx, payment, amount);
        if (result.confirmed) {
          return result;
        }
      }

      // No matching transaction found
      return { confirmed: false };
    } catch (error) {
      this.logger.error(
        `Error checking payment on blockchain: ${error.message}`,
        error.stack,
      );
      // Return not confirmed on error to allow retry
      return { confirmed: false };
    }
  }

  /**
   * Convert amount from the given currency to nano TONs
   * 1 TON = 1,000,000,000 nano TONs
   */
  /**
   * Convert amount from the given currency to nano TONs
   * 1 TON = 1,000,000,000 nano TONs
   * Returns an integer value as TON transactions require whole numbers
   */
  /**
   * Fetch exchange rate with retry logic
   * @private
   */
  /**
   * Check if a transaction matches the payment criteria
   * @param tx Transaction object from TON blockchain
   * @param payment Payment entity to match against
   * @param expectedAmount Expected payment amount in nano TONs
   * @returns Object with confirmation status and transaction details if matched
   * @private
   */
  private matchTransaction(
    tx: any,
    payment: Payment,
    expectedAmount: string | number,
  ): {
    confirmed: boolean;
    transactionHash?: string;
    senderAddress?: string;
  } {
    // Skip if transaction doesn't have required properties
    if (!tx.in_msg?.source) {
      return { confirmed: false };
    }

    // Skip transactions without text data
    if (tx.in_msg.msg_data && tx.in_msg.msg_data['@type'] !== 'msg.dataText') {
      return { confirmed: false };
    }

    const value = tx.in_msg.value; // Amount of TON in the transaction
    const customer = tx.in_msg.source; // Customer address
    const comment = tx.in_msg.message; // Comment (with orderId)

    // Check if comment matches orderId and amount matches expected amount
    if (
      payment.orderId === comment &&
      Number(value) === Number(expectedAmount)
    ) {
      // Payment is successful
      return {
        confirmed: true,
        transactionHash: tx.transaction_id?.hash || tx.hash,
        senderAddress: customer,
      };
    }

    return { confirmed: false };
  }

  /**
   * Get transactions for a specific TON address
   * @param address TON wallet address
   * @param limit Maximum number of transactions to return
   * @private
   */
  private async getTransactions(
    address: string,
    limit: number = 10,
  ): Promise<any[]> {
    // Check if TonWeb is initialized
    if (!this.tonweb) {
      this.logger.error('TonWeb is not initialized. Cannot get transactions.');
      return [];
    }

    try {
      // Get transactions using TonWeb
      const addressInfo = await this.tonweb.provider.getAddressInfo(address);

      if (addressInfo.balance === '0') {
        // No balance, so no transactions to check
        return [];
      }

      // Get transactions for this address
      const transactions = await this.tonweb.provider.getTransactions(
        address,
        limit,
      );

      return transactions;
    } catch (error) {
      this.logger.error(
        `Error getting transactions for address ${address}: ${error.message}`,
        error.stack,
      );

      // Return empty array on error to allow graceful handling
      return [];
    }
  }

  /**
   * Start polling for payment confirmation on the blockchain
   * @param payment Payment entity to check
   * @private
   */
  private async startPaymentConfirmationPolling(
    payment: Payment,
    maxAttempts = 50,
    delayMs = 10000, // 10 seconds between checks
  ): Promise<void> {
    this.logger.log(
      `Starting payment confirmation polling for order ${payment.orderId}`,
    );

    let attempts = 0;
    const confirmed = false;

    while (!confirmed && attempts < maxAttempts) {
      attempts++;
      this.logger.log(
        `Checking payment confirmation attempt ${attempts}/${maxAttempts} for order ${payment.orderId}`,
      );

      try {
        // Check if payment is confirmed on blockchain
        const result = await this.checkPaymentOnBlockchain(payment);

        if (result.confirmed) {
          this.logger.log(`Payment confirmed for order ${payment.orderId}`);

          await payment.save();

          await this.paymentsService.handlePaymentSuccess(payment.orderId);

          return;
        }

        // If not confirmed, wait before next check
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Error during payment confirmation polling for order ${payment.orderId}: ${errorMessage}`,
          error instanceof Error ? error.stack : undefined,
        );

        // Wait before retry even on error
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    if (!confirmed) {
      this.logger.warn(
        `Payment confirmation polling timed out for order ${payment.orderId} after ${maxAttempts} attempts`,
      );
    }
  }

  private convertToNanoTons(amount: number): number {
    const TON_SCALE = 1e9;

    return amount * TON_SCALE;
  }
}
