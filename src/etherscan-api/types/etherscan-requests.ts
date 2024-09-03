export type BaseResponse<T> = {
  jsonrpc: string;
  id: number;
  status?: string;
  result: T;
};

export type GetLastBlockResponse = BaseResponse<string>;

export type Transaction = {
  blockHash: string;
  blockNumber: number;
  from: string;
  gas: string;
  gasPrice: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  type: string;
  v: string;
  r: string;
  s: string;
};

type BlockDataResult = {
  difficulty: number;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: number;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: number;
  transactions: Transaction[];
  transactionsRoot: string;
  uncles: string[];
};
export type GetBlockDataResponse = BaseResponse<BlockDataResult> & {
  status?: string;
};
