import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterContentDocument = NewsletterContent & Document;

@Schema()
export class NewsletterContent {
  @Prop()
  newsletterId: string;

  @Prop()
  image: string;

  @Prop()
  heading: string;

  @Prop()
  text: string;

  @Prop()
  link: string;
}

export const NewsletterContentSchema =
  SchemaFactory.createForClass(NewsletterContent);
