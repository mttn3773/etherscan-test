import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FetchService, RequestMethod } from 'src/fetch/fetch.service';
import {
  BaseResponse,
  GetBlockDataResponse,
  GetLastBlockResponse,
  Transaction,
} from './types/etherscan-requests';
import { TransactionDTO } from './types/transaction';
import { sleep } from 'src/lib/utils/sleep';
import BigNumber from 'bignumber.js';

@Injectable()
export class EtherscanApiService {
  private apiKey: string;

  private readonly baseUrl = 'https://api.etherscan.io/api';

  // Etherscan response message when request limit reached
  private readonly MAX_RATE_LIMIT_REACHER_MESSAGE_PREFIX =
    'Max calls per sec rate limit reached';

  // Etherscan another response message when request limit reached
  private readonly RATE_LIMIT_REACHED_MESSAGE = 'Max rate limit reached';

  // Sleep duration after request limit reached
  // ms
  private readonly SLEEP_TIMEOUT = 1000;

  constructor(private readonly fetchService: FetchService) {
    const apiKey = process.env.ETHERSCAN_API_KEY;

    if (!apiKey) {
      throw new Error('ETHERSCAN_API_KEY is not defined');
    }

    this.apiKey = apiKey;
  }

  async getLastBlock() {
    const url = new URL(this.baseUrl);

    url.searchParams.append('module', 'proxy');
    url.searchParams.append('action', 'eth_blockNumber');
    url.searchParams.append('apikey', this.apiKey);

    const response = await this.fetchWithRetries<GetLastBlockResponse>([
      'GET',
      url.toString(),
    ]);

    return response;
  }

  async getBlockTransactions(block: string) {
    const url = new URL(this.baseUrl);

    url.searchParams.append('module', 'proxy');
    url.searchParams.append('action', 'eth_getBlockByNumber');
    url.searchParams.append('tag', block);
    url.searchParams.append('boolean', 'true');
    url.searchParams.append('apikey', this.apiKey);

    const blockData = await this.fetchWithRetries<GetBlockDataResponse>([
      'GET',
      url.toString(),
    ]);

    return (
      blockData?.result?.transactions?.map((tx) => this.transactionToDTO(tx)) ??
      []
    );
  }

  private transactionToDTO(tx: Transaction): TransactionDTO {
    return {
      from: tx.from,
      to: tx.to,
      value: new BigNumber(tx.value),
    };
  }

  private async fetchWithRetries<T extends BaseResponse<any>>(
    params: Parameters<FetchService['makeRequest']>,
    retries: number = 5,
  ): Promise<T> {
    if (retries < 0) {
      throw new HttpException('Failed to fetch data', 500);
    }

    const res = await this.fetchService.makeRequest<T>(...params).catch((e) => {
      if (retries > 0) {
        return this.fetchWithRetries<T>(params, retries - 1);
      }
    });

    if (res?.status && +res?.status === 0) {
      if (this.isRateLimitError(res.result)) {
        await sleep(this.SLEEP_TIMEOUT);

        return this.fetchWithRetries<T>(params, retries);
      }

      return this.fetchWithRetries<T>(params, retries - 1);
    }

    if (!res) {
      return this.fetchWithRetries<T>(params, retries - 1);
    }

    return res;
  }

  private isRateLimitError = (result: string): boolean => {
    return (
      result.startsWith(this.MAX_RATE_LIMIT_REACHER_MESSAGE_PREFIX) ||
      result === this.RATE_LIMIT_REACHED_MESSAGE
    );
  };
}
