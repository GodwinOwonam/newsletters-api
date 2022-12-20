import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SubscriptionCredentialsDto } from './dto/subscription-credentials.dto';
import { Subscriber } from './schemas/subscribers.schema';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async subscribe(
    @Body() subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<Subscriber> {
    return await this.subscribersService.create(subscriptionCredentials);
  }

  @Get()
  async findAll() {
    return await this.subscribersService.findAll();
  }

  // INSERT DELETE CODE HERE
  @Delete('/')
  async unsubscribe(
    @Body() subscriptionCredentials: SubscriptionCredentialsDto,
  ) {
    return await this.subscribersService.unsubscribe(subscriptionCredentials);
  }
}
