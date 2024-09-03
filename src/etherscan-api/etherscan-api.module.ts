import { Module } from '@nestjs/common';
import { EtherscanApiService } from './etherscan-api.service';
import { FetchModule } from 'src/fetch/fetch.module';

@Module({
  imports: [FetchModule],
  exports: [EtherscanApiService],
  providers: [EtherscanApiService],
  controllers: [],
})
export class EtherscanApiModule {}
