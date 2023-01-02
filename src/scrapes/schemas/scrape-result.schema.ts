import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScrapeResultDocument = ScrapeResult & Document;

@Schema()
export class ScrapeResult {
  @Prop({ required: true })
  scrapeId: string;

  @Prop({ required: true })
  css: string;

  @Prop({ required: true })
  index: number;

  @Prop({ required: true, default: false })
  isImage: boolean;

  @Prop()
  imageSrc: string;

  @Prop({ required: true, default: false })
  isText: boolean;

  @Prop()
  innerText: string;

  @Prop({ required: true })
  url: string;
}

export const ScrapeResultSchema = SchemaFactory.createForClass(ScrapeResult);
