import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionCredentialsDto } from './dto/subscription-credentials.dto';
import { Subscriber, SubscriberDocument } from './schemas/subscribers.schema';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<SubscriberDocument>,
  ) {}

  async create(
    subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<Subscriber> {
    return await this.subscriberModel.create(subscriptionCredentials);
  }

  async findAll(): Promise<Subscriber[]> {
    return await this.subscriberModel.find().exec();
  }

  async unsubscribe(
    subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<{ message: string } | any> {
    const { email } = subscriptionCredentials;
    const unsubscribedEmail = await this.subscriberModel
      .findOneAndRemove({
        email,
      })
      .exec();

    return unsubscribedEmail;
  }
}
