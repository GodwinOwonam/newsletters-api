import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriberDocument } from 'src/subscribers/schemas/subscribers.schema';
import { SubscribersService } from 'src/subscribers/subscribers.service';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import {
  NewsletterContent,
  NewsletterContentDocument,
} from './schemas/newsletter-content.schema';
import { Newsletter, NewsletterDocument } from './schemas/newsletter.schema';

@Injectable()
export class NewslettersService {
  constructor(
    @InjectModel(Newsletter.name)
    private model: Model<NewsletterDocument>,
    @InjectModel(NewsletterContent.name)
    private newsletterContent: Model<NewsletterContentDocument>,
    private readonly subscriberService: SubscribersService,
    private readonly mailerService: MailerService,
  ) {}

  async createNewsletter(newsletterDto: CreateNewsletterDto): Promise<string> {
    const { subject, title, contents } = newsletterDto;
    const subscribers = await this.getSubscribers();
    const subscriberCount = subscribers.length;

    for (const subscriber of subscribers) {
      try {
        await this.mailerService.sendMail({
          to: subscriber.email,
          from: 'godwin.owonamg5@gmail.com',
          subject,
          template: 'newsletter',
          context: {
            email: subscriber.email,
            title,
            contents,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    await this.createNewsletterData(newsletterDto, subscriberCount);

    return 'success';
  }

  async getAllNewsletters(): Promise<NewsletterDocument[]> {
    return await this.model.find().exec();
  }

  // private functions begin here
  private async getSubscribers(): Promise<SubscriberDocument[]> {
    return await this.subscriberService.findAll();
  }

  private async createNewsletterData(
    newsletterDto: CreateNewsletterDto,
    subscriberCount: number,
  ): Promise<void> {
    const newsletter = await this.model.create({
      subject: newsletterDto.subject,
      title: newsletterDto.title,
      estimatedSubscribers: subscriberCount,
      date: new Date(),
    });

    newsletterDto.contents.forEach(async (content) => {
      await this.newsletterContent.create({
        newsletterId: newsletter._id,
        image: content.image.length ? content.image : '',
        heading: content.heading.length ? content.heading : '',
        text: content.text.length ? content.text : '',
        link: content.link.length ? content.link : '',
      });
    });
  }
}
