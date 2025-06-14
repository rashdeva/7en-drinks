import { useMutation } from "@tanstack/react-query";
import { checkInTonPayment } from "~/db/api";
import { PaymentStatus } from "~/db/models";
import { useTonPay } from "~/hooks/useTonPay";

export const useCheckIn = () => {
  const { mutateAsync: payTonOrder } = useTonPay();

  return useMutation({
    mutationFn: checkInTonPayment,
    onSuccess: async (response) => {
      if(response.status === PaymentStatus.NEW) {
        await payTonOrder(response);
      }
    },
    onError: () => {},
  });
};
