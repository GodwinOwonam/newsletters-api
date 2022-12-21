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
import { IResponse } from './interfaces/response.interface';
import { Subscriber } from './schemas/subscribers.schema';
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
  async findAll(): Promise<Subscriber[] | IResponse> {
    return await this.subscribersService.findAll();
  }

  @Delete('/')
  async unsubscribe(
    @Body() subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<IResponse | any> {
    return await this.subscribersService.unsubscribe(subscriptionCredentials);
  }
}
