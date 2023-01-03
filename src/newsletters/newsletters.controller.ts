import { Body, Controller, Get, Post } from '@nestjs/common';
import { IResponse } from 'src/subscribers/interfaces/response.interface';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { NewslettersService } from './newsletters.service';

@Controller('newsletters')
export class NewslettersController {
  constructor(private readonly newsletterService: NewslettersService) {}

  @Get()
  async getAllNewsletters(): Promise<IResponse> {
    return {
      status: true,
      data: await this.newsletterService.getAllNewsletters(),
    };
  }

  @Post()
  async createNewsletter(
    @Body() newsletterData: CreateNewsletterDto,
  ): Promise<IResponse> {
    return {
      status: true,
      data: await this.newsletterService.createNewsletter(newsletterData),
    };
  }
}
