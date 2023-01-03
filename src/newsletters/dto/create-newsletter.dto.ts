import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class NewsletterContentDto {
  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  heading: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  link: string;
}

export class CreateNewsletterDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  contents: NewsletterContentDto[];
}
