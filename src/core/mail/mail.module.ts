import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { MailService } from './mail.service';

@Module({
  imports: [
    // Підключаємо модуль поштового сервісу
    MailerModule.forRoot({
      transport: process.env.MAIL_URL, // Встановлюємо параметри транспорту для відправки листів
      defaults: {
        from: '"nest-final.project.sept2022" <sept2022@nestjs.com>', // За замовчуванням вказується адреса електронної пошти відправника
      },
      template: {
        dir: path.join(__dirname, '..', '..', '..', 'templates'), // Вказуємо шлях до теки з шаблонами листів
        adapter: new HandlebarsAdapter(), // Використання адаптера для Handlebars шаблонізатора
        options: {
          strict: true, // Встановлення строгого режиму для шаблонів Handlebars
        },
      },
    }),
  ],
  providers: [MailService], // Постачальник сервісу пошти
  exports: [MailService], // Експорт сервісу пошти для використання у інших модулях
})
export class MailModule {}
