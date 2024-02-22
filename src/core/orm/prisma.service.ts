import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';

config(); // Завантажує конфігурацію з файлу .env

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  // Підключається до бази даних при ініціалізації модуля
  async onModuleInit() {
    await this.$connect();
  }

  // Відключається від бази даних при знищенні модуля
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Включає гачки відключення для додатка Nest.js
  async enableShutdownHooks(app: INestApplication) {
    app.enableShutdownHooks();
  }
}
