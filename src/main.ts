import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cors from 'cors';

import { PrismaService } from './core/orm/prisma.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Створення екземпляру додатку за допомогою функції `NestFactory.create` і передачі класу `AppModule`
  const prismaService = app.get(PrismaService); // Отримання екземпляру сервісу `PrismaService` з додатку

  await prismaService.onModuleInit(); // Виклик методу `onModuleInit` для ініціалізації сервісу `PrismaService`

  app.useGlobalPipes(new ValidationPipe()); // Встановлення глобальної обробки валідації запитів

  // CORS
  // app.enableCors({
  //   origin: 'http://localhost:4200',
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });

  // Налаштування Swagger
  const config = new DocumentBuilder() // Створення нового екземпляру класу `DocumentBuilder`
    .setTitle('Final-project example') // Встановлення назви документації(API)
    .setDescription('The final-project API description') // Встановлення опису документації
    .setVersion('1.0') // Встановлення версії API
    .addTag('final-project') // Додавання тегу до документації
    .build(); // Побудова об'єкту конфігурації Swagger
  const document = SwaggerModule.createDocument(app, config); // Створення документації Swagger
  SwaggerModule.setup('api/doc', app, document); // Налаштування Swagger для шляху '/api/doc'

  prismaService.enableShutdownHooks(app); // Включення обробника зупинки для сервісу `PrismaService`

  // Налаштування CORS
  app.use(
    cors({
      origin: 'http://localhost:4200',
      credentials: true,
    }),
  );

  await app.listen(3006); // Прослуховування порту
}
bootstrap();
