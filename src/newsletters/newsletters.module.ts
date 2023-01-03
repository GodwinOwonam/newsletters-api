import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribersModule } from 'src/subscribers/subscribers.module';
import { NewslettersController } from './newsletters.controller';
import { NewslettersService } from './newsletters.service';
import {
  NewsletterContent,
  NewsletterContentSchema,
} from './schemas/newsletter-content.schema';
import { Newsletter, NewsletterSchema } from './schemas/newsletter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Newsletter.name, schema: NewsletterSchema },
      { name: NewsletterContent.name, schema: NewsletterContentSchema },
    ]),
    SubscribersModule,
  ],
  controllers: [NewslettersController],
  providers: [NewslettersService],
})
export class NewslettersModule {}
