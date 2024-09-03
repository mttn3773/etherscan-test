import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EtherscanApiModule } from './etherscan-api/etherscan-api.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalErrorInterceptor } from './intercaptors/error-intercaptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    EtherscanApiModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.dev.env'],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalErrorInterceptor,
    },
  ],
})
export class AppModule {}
