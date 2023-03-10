import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriberDocument = Subscriber & Document;

@Schema()
export class Subscriber {
  @Prop({ required: true })
  email: string;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
