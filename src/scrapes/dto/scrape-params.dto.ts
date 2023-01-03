import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

class ScrapeSelector {
  @IsString()
  @IsNotEmpty()
  css: string;

  @IsNumber()
  @IsPositive()
  maxCount: string;

  @IsNotEmpty()
  @IsBoolean()
  isImage: boolean;

  @IsNotEmpty()
  @IsBoolean()
  getInnerText: boolean;
}

export class ScrapeParamsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  selectors: ScrapeSelector[];
}
