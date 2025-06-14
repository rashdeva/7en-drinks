import { useTonConnectUI } from "@tonconnect/ui-react";
import { notifyTonPaymentInitiated } from "~/db/api";
import { PaymentModel } from "~/db/models";
import { TonSDK } from "~/lib/ton";
import { useMutation } from "@tanstack/react-query";

export const useTonPay = () => {
  const [tonConnectUI] = useTonConnectUI();
  const tonSDK = new TonSDK(tonConnectUI);

  return useMutation({
    mutationFn: async (payment: PaymentModel) => {
      if (!payment.orderId || !payment.amount) {
        throw new Error("Payment data is incomplete");
      }

      try {
        await tonSDK.payOrder(
          payment.orderId,
          Number(payment.amount),
          payment.masterAddress
        );

        // Notify backend that payment has been initiated
        await notifyTonPaymentInitiated(payment.orderId);
      } catch (error) {
        throw new Error(`Payment failed: ${error}`);
      }
    },
  });
};
