import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: process.env.MAIL_URL,
      defaults: {
        from: '"nest-final.project.sept2022" <sept2022@nestjs.com>',
      },
      template: {
        dir: path.join(__dirname, '..', '..', '..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
