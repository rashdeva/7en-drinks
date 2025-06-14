import { beginCell, Cell } from "@ton/core";
import { SendTransactionResponse, TonConnectUI } from "@tonconnect/ui-react";

interface TransactionMessage {
  address: string;
  amount: string;
  payload: string;
}

interface Transaction {
  validUntil: number;
  messages: TransactionMessage[];
}

export class TonSDK {
  private tonConnect: TonConnectUI;

  constructor(tonConnect: TonConnectUI) {
    this.tonConnect = tonConnect;
  }

  /**
   * Send TON to a specified address with an optional comment
   * @param options - Transaction options
   * @returns Promise<Transaction>
   */
  async sendTon(options: {
    to: string;
    amount: string | number;
    comment?: string;
    validityPeriod?: number;
  }): Promise<SendTransactionResponse> {
    const { to, amount, comment = "", validityPeriod = 60 } = options;

    // Create cell with comment if provided
    const body = comment
      ? beginCell().storeUint(0, 32).storeStringTail(comment).endCell()
      : undefined;

    const transaction: Transaction = {
      validUntil: Math.floor(Date.now() / 1000) + validityPeriod,
      messages: [
        {
          address: to,
          amount: amount.toString(),
          payload: body ? body.toBoc().toString("base64") : "",
        },
      ],
    };

    try {
      return await this.tonConnect.sendTransaction(transaction);
    } catch (e) {
      console.error("Error sending TON transaction:", e);
      throw e;
    }
  }

  async payOrder(
    queryId: string,
    amount: number,
    masterAddress: string,
    validityPeriod: number = 60
  ): Promise<SendTransactionResponse> {
    const body: Cell = beginCell()
      .storeUint(0, 32)
      .storeStringTail(queryId)
      .endCell();

    const transaction: Transaction = {
      validUntil: Math.floor(Date.now() / 1000) + validityPeriod,
      messages: [
        {
          address: masterAddress,
          amount: amount.toString(),
          payload: body.toBoc().toString("base64"),
        },
      ],
    };

    try {
      return await this.tonConnect.sendTransaction(transaction);
    } catch (e) {
      throw new Error(`${e}`);
    }
  }
}
