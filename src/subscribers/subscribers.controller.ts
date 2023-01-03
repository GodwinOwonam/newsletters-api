import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { SubscriptionCredentialsDto } from './dto/subscription-credentials.dto';
import { IResponse } from './interfaces/response.interface';
import { Subscriber, SubscriberDocument } from './schemas/subscribers.schema';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  async subscribe(
    @Body() subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<Subscriber | IResponse> {
    return await this.subscribersService.create(subscriptionCredentials);
  }

  @Get()
  async findAll(): Promise<SubscriberDocument[] | IResponse> {
    const subscribers = await this.subscribersService.findAll();
    return {
      status: true,
      data: subscribers,
    };
  }

  @Delete('/')
  async unsubscribe(
    @Body() subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<IResponse | any> {
    return await this.subscribersService.unsubscribe(subscriptionCredentials);
  }
}
