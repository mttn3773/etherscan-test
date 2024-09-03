import BigNumber from "bignumber.js";

export type TransactionDTO = {
  from: string;
  to: string;
  value: BigNumber;
};
