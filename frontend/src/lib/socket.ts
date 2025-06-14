import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

// Define payment status update event type
export interface PaymentStatusUpdate {
  orderId: string;
  status: string;
}

// Socket instance that will be lazily initialized
let socket: Socket | null = null;

/**
 * Initialize the socket connection to the payments namespace
 */
export const initializeSocket = (): Socket => {
  if (!socket) {
    // Get the backend URL from environment or use default
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    socket = io(`${backendUrl}/payments`, {
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000, // Increase timeout to 20 seconds
      forceNew: true, // Create a new connection each time
    });

    socket.on("connect", () => {
      // Connected to payment WebSocket server
    });

    socket.on("disconnect", (reason: string) => {
      // If we were disconnected due to an error, try to reconnect
      if (reason === "io server disconnect" || reason === "transport close") {
        // The disconnection was initiated by the server, reconnect manually
        socket?.connect();
      }
    });

    socket.on("connect_error", () => {
      // Handle connection errors silently
    });

    socket.on("reconnect", () => {
      // Successfully reconnected
    });

    socket.on("reconnect_attempt", () => {
      // Attempting to reconnect
    });

    socket.on("reconnect_error", () => {
      // Reconnection error
    });

    socket.on("reconnect_failed", () => {
      // Reconnection failed after all attempts
    });
  }

  return socket;
};

/**
 * Get the socket instance, initializing it if necessary
 */
export const getSocket = (): Socket => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Join a specific order room to receive updates for that order
 * @param orderId The order ID to subscribe to
 * @param userId The user ID who made the payment
 */
export const joinPaymentRoom = (orderId: string, userId: string): void => {
  const socket = getSocket();
  socket.emit("joinPaymentRoom", { orderId, userId });
};

/**
 * Custom hook to subscribe to payment status updates
 * @param orderId Optional order ID to filter updates for a specific order
 * @returns The latest payment status update
 */
export const usePaymentStatusUpdates = (orderId: string, userId: string) => {
  const [statusUpdate, setStatusUpdate] = useState<PaymentStatusUpdate | null>(
    null
  );

  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => {
      if (orderId && userId) {
        joinPaymentRoom(orderId, userId);
      }
    };

    const handleConnectError = () => {
      // Handle connection errors silently
    };

    const handleDisconnect = () => {
      // Handle disconnection silently
    };

    // Listen for payment status updates
    const handleStatusUpdate = (update: PaymentStatusUpdate) => {
      // Only process updates for the specified order if an order ID is provided
      if (!orderId || update.orderId === orderId) {
        setStatusUpdate(update);
      }
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("paymentStatusUpdate", handleStatusUpdate);

    // If socket is already connected, join the room immediately
    if (socket.connected && orderId && userId) {
      joinPaymentRoom(orderId, userId);
    }

    // Clean up the event listeners when the component unmounts
    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off("paymentStatusUpdate", handleStatusUpdate);
    };
  }, [orderId, userId]);

  return statusUpdate;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
