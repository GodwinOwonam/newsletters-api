import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NewsletterDocument = Newsletter & Document;

@Schema()
export class Newsletter {
  @Prop()
  subject: string;

  @Prop()
  title: string;

  @Prop()
  estimatedSubscribers: number;

  @Prop({ default: new Date() })
  date: Date;
}

export const NewsletterSchema = SchemaFactory.createForClass(Newsletter);
