import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

import { PrismaService } from './core/orm/prisma.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  await prismaService.onModuleInit();

  app.useGlobalPipes(new ValidationPipe());

  // CORS
  // app.enableCors({
  //   origin: 'http://localhost:4200',
  //   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // });

  const config = new DocumentBuilder()
    .setTitle('Final-project example')
    .setDescription('The final-project API description')
    .setVersion('1.0')
    .addTag('final-project')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/doc', app, document);

  prismaService.enableShutdownHooks(app);

  app.use(
    cors({
      origin: 'http://localhost:4200',
      credentials: true,
    }),
  );

  await app.listen(3006);
}
bootstrap();
