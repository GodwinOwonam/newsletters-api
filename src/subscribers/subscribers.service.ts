import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriptionCredentialsDto } from './dto/subscription-credentials.dto';
import { IResponse } from './interfaces/response.interface';
import { Subscriber, SubscriberDocument } from './schemas/subscribers.schema';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private readonly subscriberModel: Model<SubscriberDocument>,
  ) {}

  async create(
    subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<Subscriber | IResponse> {
    const { email } = subscriptionCredentials;

    const subscriberExists = await this.subscriberModel.findOne({ email });

    if (subscriberExists) {
      return {
        status: false,
        message: `${email} is already a subscriber!`,
      };
    }

    const subscriber = await this.subscriberModel.create(
      subscriptionCredentials,
    );

    if (!subscriber) {
      throw new InternalServerErrorException('Subscriber registration failed!');
    }

    return {
      status: true,
      message: 'You have successfully subscribed to our newsletter!',
    };
  }

  async findAll(): Promise<Subscriber[] | IResponse> {
    const subscribers = await this.subscriberModel.find().exec();

    return {
      status: true,
      data: subscribers,
    };
  }

  async unsubscribe(
    subscriptionCredentials: SubscriptionCredentialsDto,
  ): Promise<IResponse | any> {
    const { email } = subscriptionCredentials;
    const unsubscribedEmail = await this.subscriberModel
      .findOneAndRemove({
        email,
      })
      .exec();

    if (!unsubscribedEmail) {
      throw new InternalServerErrorException('Could not cancel subscription!');
    }

    return {
      status: true,
      message: 'You have successfully unsubscribed from our newsletter',
    };
  }
}
