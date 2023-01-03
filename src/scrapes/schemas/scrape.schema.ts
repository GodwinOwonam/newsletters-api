import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScrapeDocument = Scrape & Document;

@Schema()
export class Scrape {
  @Prop({ required: true, unique: true, type: String })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;
}

export const ScrapeSchema = SchemaFactory.createForClass(Scrape);
