import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Payment } from './entities/payment.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'payments',
})
export class PaymentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(PaymentsGateway.name);

  // Map to store user connections with their userId and orderId
  private userConnections: Map<string, { userId: string; orderIds: string[] }> =
    new Map();

  afterInit() {
    this.logger.log('Payment WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    // Initial connection doesn't have user data yet
    // User will identify themselves via joinPaymentRoom event
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove user from connections map
    this.userConnections.delete(client.id);
  }

  /**
   * Handle client joining a payment room to track their payment
   * @param client Socket client
   * @param payload Payload containing userId and orderId
   */
  @SubscribeMessage('joinPaymentRoom')
  handleJoinPaymentRoom(
    client: Socket,
    payload: { userId: string; orderId: string },
  ) {
    const { userId, orderId } = payload;

    // Store user connection with their userId
    const userConnection = this.userConnections.get(client.id) || {
      userId,
      orderIds: [],
    };
    if (!userConnection.orderIds.includes(orderId)) {
      userConnection.orderIds.push(orderId);
    }
    this.userConnections.set(client.id, userConnection);

    // Join a room specific to this order
    client.join(`order_${orderId}`);

    // Also join a room specific to this user (for all their orders)
    client.join(`user_${userId}`);

    this.logger.log(
      `Client ${client.id} (User: ${userId}) joined payment rooms for order: ${orderId}`,
    );
  }

  /**
   * Notify clients about payment status update
   * @param payment Payment object with updated status
   */
  async notifyPaymentStatusUpdate(payment: Payment) {
    this.logger.log(
      `Emitting payment status update for order: ${payment.orderId}`,
    );

    const userId = payment.user.toString();

    const paymentUpdate = {
      orderId: payment.orderId,
      status: payment.status,
    };

    // Payment update ready to be sent

    // First, emit to all sockets in the user-specific room if it exists
    try {
      const userRoomName = `user_${userId}`;
      this.logger.log(`Emitting payment update to user room: ${userRoomName}`);
      this.server.to(userRoomName).emit('paymentStatusUpdate', paymentUpdate);
    } catch (error) {
      this.logger.error(`Error sending message to user room: ${error.message}`);
    }

    // Also emit to the order-specific room
    // This ensures the user gets the update even if they reconnected with a new socket
    try {
      const orderRoomName = `order_${payment.orderId}`;
      this.logger.log(
        `Emitting payment update to order room: ${orderRoomName}`,
      );
      this.server.to(orderRoomName).emit('paymentStatusUpdate', paymentUpdate);
    } catch (error) {
      this.logger.error(
        `Error sending message to order room: ${error.message}`,
      );
    }

    // As a last resort, try to find a direct socket connection for this user
    let userClientId: string | undefined;
    for (const [clientId, connection] of this.userConnections.entries()) {
      if (connection.userId === userId) {
        userClientId = clientId;
        break;
      }
    }

    if (userClientId) {
      try {
        if (this.server && this.server.sockets && this.server.sockets.sockets) {
          const clientSocket = this.server.sockets.sockets.get(userClientId);
          if (clientSocket) {
            this.logger.log(
              `Sending payment update directly to user ${userId} (client: ${userClientId})`,
            );
            clientSocket.emit('paymentStatusUpdate', paymentUpdate);
          }
        }
      } catch (error) {
        this.logger.error(
          `Error sending direct message to client: ${error.message}`,
        );
      }
    }
  }
}
