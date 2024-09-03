import { Controller, Get, HttpException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/max-change')
  async getMaxChange() {
    const address = await this.appService.getAddressWithMaxBalanceChange();
    return { address };
  }
}
