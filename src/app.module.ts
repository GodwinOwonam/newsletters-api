import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TodoitemsModule } from './todoitems/todoitems.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { NewslettersModule } from './newsletters/newsletters.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/newsletters-api';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(databaseUrl),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: configService.get('EMAIL_PORT'),
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, 'mails'),
          adapter: new HandlebarsAdapter(),
        },
      }),
    }),
    TodoitemsModule,
    SubscribersModule,
    NewslettersModule,
    // ScrapesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
