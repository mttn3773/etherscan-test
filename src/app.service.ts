import { HttpException, Injectable } from '@nestjs/common';
import { EtherscanApiService } from './etherscan-api/etherscan-api.service';
import { generateDecrementingHexValues } from './lib/utils/subtract-hex';
import { TransactionDTO } from './etherscan-api/types/transaction';
@Injectable()
export class AppService {
  // Number of previous blocks to search for getAddressWithMaxBalanceChange calculation
  private readonly BLOCKS_TO_SEARCH_COUNT = 100;

  constructor(private readonly etherscanApiService: EtherscanApiService) {}

  async getAddressWithMaxBalanceChange(): Promise<string> {
    // Get last block hex
    const lastBlock = await this.etherscanApiService
      .getLastBlock()
      .catch((e) => {
        throw new HttpException(e.message, e.status);
      });

    // Get last 100 blocks hex
    const lastBlocks = generateDecrementingHexValues(
      lastBlock.result,
      this.BLOCKS_TO_SEARCH_COUNT,
    );

    // Get transactions for each block

    const transactions: TransactionDTO[] = await Promise.all(
      lastBlocks.map(async (block) => {
        return this.etherscanApiService
          .getBlockTransactions(block)
          .catch((e) => {
            throw new HttpException(e.message, e.status);
          });
      }),
    ).then((res) => res.flat());

    const balanceChangeMap = new Map();

    // Add up balance change for each address in transactions
    transactions.forEach((tx) => {
      const { from, to, value } = tx;

      balanceChangeMap.set(from, value.add(balanceChangeMap.get(from) ?? 0));
      balanceChangeMap.set(to, value.add(balanceChangeMap.get(to) ?? 0));
    });

    const { address } = Array.from(balanceChangeMap.entries()).reduce(
      (acc, [address, change]) => {
        if (change > acc.change) {
          return { address, change };
        }
        return acc;
      },
      { address: '', change: 0 },
    );

    return address;
  }
}
