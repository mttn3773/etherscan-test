import { Global, Module } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [FetchService],
  providers: [FetchService],
  controllers: [],
})

export class FetchModule {}
