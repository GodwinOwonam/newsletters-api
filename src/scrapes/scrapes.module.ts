import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ScrapeResult,
  ScrapeResultSchema,
} from './schemas/scrape-result.schema';
import { Scrape, ScrapeSchema } from './schemas/scrape.schema';
import { ScrapesController } from './scrapes.controller';
import { ScrapesService } from './scrapes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Scrape.name, schema: ScrapeSchema },
      { name: ScrapeResult.name, schema: ScrapeResultSchema },
    ]),
  ],
  controllers: [ScrapesController],
  providers: [ScrapesService],
})
export class ScrapesModule {}
