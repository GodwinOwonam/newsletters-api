import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { IResponse } from 'src/subscribers/interfaces/response.interface';
import { ScrapeParamsDto } from './dto/scrape-params.dto';
import { SearchAndFilterDto } from './dto/search-and-filter.dto';
import { ScrapesService } from './scrapes.service';

@Controller('scrapes')
export class ScrapesController {
  constructor(private scrapeService: ScrapesService) {}

  @Post()
  async scrape(@Body() scrapeParams: ScrapeParamsDto): Promise<IResponse> {
    return {
      status: true,
      data: await this.scrapeService.scrape(scrapeParams),
    };
    // return this.scrapeService.scrape(scrapeParams);
  }

  @Get()
  async getAllScrapes(
    @Query() searchAndFilter: SearchAndFilterDto,
  ): Promise<IResponse> {
    return {
      status: true,
      data: await this.scrapeService.getAllScrapes(searchAndFilter),
    };
  }

  @Get('/:id')
  async getScrapeResultsByScrapeId(
    @Param('id') id: string,
  ): Promise<IResponse | any> {
    return {
      status: true,
      data: await this.scrapeService.getScrapeResultsByScrapeId(id),
    };
  }
}
