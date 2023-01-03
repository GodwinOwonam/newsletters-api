import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ScrapeResult,
  ScrapeResultDocument,
} from './schemas/scrape-result.schema';
import { Scrape, ScrapeDocument } from './schemas/scrape.schema';
import puppeteer from 'puppeteer';
import { ScrapeParamsDto } from './dto/scrape-params.dto';
import { SearchAndFilterDto } from './dto/search-and-filter.dto';

interface ScrapeResults {
  scrape: Scrape;
  results: ScrapeResult[];
}

interface Result {
  css: string;
  index: number;
  isImage: boolean;
  imageSrc?: string;
  isText: boolean;
  innerText?: string;
  url: string;
}

@Injectable()
export class ScrapesService {
  constructor(
    @InjectModel(Scrape.name)
    private readonly scrapeModel: Model<ScrapeDocument>,
    @InjectModel(ScrapeResult.name)
    private readonly scrapeResultModel: Model<ScrapeResultDocument>,
  ) {}

  async scrape(scrapeParams: ScrapeParamsDto): Promise<ScrapeResults | any> {
    const { title, url, selectors } = scrapeParams;

    const scrapeExists = await this.scrapeModel.findOne({ title }).exec();

    if (scrapeExists) {
      throw new ConflictException(
        `Scrape with title ${scrapeExists.title} already exists`,
      );
    }

    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 0,
    });

    try {
      const scrape = await this.scrapeModel.create({
        title,
        url,
        createdAt: new Date(),
      });
      let scrapeResult: Result;
      for (const selector of selectors) {
        const { maxCount } = selector;
        for (let i = +maxCount; i > 0; i--) {
          scrapeResult = await page.evaluate(
            async (i, maxCount, url, selector) => {
              const { css, isImage, getInnerText } = selector;
              try {
                const elements = document.querySelectorAll(css);
                console.log(elements);
                if (isImage) {
                  const currentElement = elements[
                    +maxCount - i
                  ] as HTMLImageElement;
                  const imageSrc = currentElement.src;
                  return {
                    css,
                    index: i + 1,
                    isImage,
                    imageSrc,
                    isText: false,
                    innerText: '',
                    url,
                  };
                } else if (getInnerText) {
                  const currentElement = elements[+maxCount - i] as HTMLElement;
                  console.log(currentElement);

                  const innerText = currentElement.innerText;
                  console.log(innerText);

                  return {
                    css,
                    index: i + 1,
                    isImage: false,
                    imageSrc: '',
                    isText: getInnerText,
                    innerText,
                    url,
                  };
                }
              } catch (error) {
                console.log(error);
              }
            },
            i,
            maxCount,
            url,
            selector,
          );
          await this.scrapeResultModel.create({
            ...scrapeResult,
            scrapeId: scrape._id,
          });
        }
      }

      const results: ScrapeResult[] = await this.scrapeResultModel
        .find({
          scrapeId: scrape._id,
        })
        .exec();
      const finalResult: ScrapeResults = {
        scrape,
        results,
      };
      browser.disconnect();
      browser.close();
      return finalResult;
    } catch (error) {
      return error;
    }
  }

  async getAllScrapes(
    searchAndFilter: SearchAndFilterDto,
  ): Promise<Scrape[] | any> {
    const { searchField, search, page, limit } = searchAndFilter;

    const pageLimit = !!limit ? +limit : 5;
    const pageNumber = (!!page ? +page - 1 : 0) * pageLimit;

    let results: Scrape[];
    if (searchField && searchField.length && search && search.length) {
      results = await this.scrapeModel
        .find({ [searchField]: { $regex: search, $options: 'i' } })
        .skip(pageNumber)
        .limit(pageLimit)
        .exec();
    } else {
      results = await this.scrapeModel
        .find()
        .skip(pageNumber)
        .limit(pageLimit)
        .exec();
    }
    return results;
  }

  async getScrapeResultsByScrapeId(
    id: string,
  ): Promise<ScrapeResults | string> {
    // return id;
    try {
      const scrapeExists = await this.scrapeModel.findOne({ _id: id }).exec();

      if (!scrapeExists) {
        throw new HttpException(`Scrape with id ${id} not found!`, 404);
      }

      const scrapeResults = await this.scrapeResultModel
        .find({ scrapeId: scrapeExists._id })
        .exec();

      return {
        scrape: scrapeExists,
        results: scrapeResults,
      };
    } catch (error) {
      throw new HttpException(`Scrape with id ${id} not found!`, 404);
    }
  }
}
