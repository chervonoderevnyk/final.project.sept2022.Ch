import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {} // Ініціалізуємо сервіс пошти через конструктор

  send(
    to: string, // Адреса, на яку буде відправлено пошту
    subject: string, // Тема листа
    template: string, // Назва шаблону повідомлення
    templateData?: any, // Дані для використання у шаблоні (опціонально)
  ): Promise<SentMessageInfo> {
    // Функція відправлення пошти з параметрами і типом поверненого значення
    return this.mailerService.sendMail({
      // Викликаємо метод для відправлення пошти з переданими параметрами
      to, // Параметр "кому"
      subject, // Параметр "тема"
      template, // Параметр "шаблон"
      context: templateData, // Параметр "дані для шаблону"
    });
  }
}
