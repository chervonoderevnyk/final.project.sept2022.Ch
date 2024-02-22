import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { ValidationsService } from '../core/validations/validations.service';

@Injectable()
export class CommentService {
  constructor(
    // Впровадження залежностей
    private readonly prismaService: PrismaService, // Впровадження залежностей для взаємодії з базою даних через Prisma
    private readonly validationsService: ValidationsService, // Впровадження залежностей для валідації даних
  ) {}

  // Створення коментаря для певного замовлення
  async createComment(
    orderId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    const { commentText } = createCommentDto;

    if (!commentText) {
      throw new HttpException(
        'Текст коментаря відсутній',
        HttpStatus.BAD_REQUEST,
      );
    } // Перевірка наявності тексту коментаря

    const filteredCommentText =
      this.validationsService.checkForBadWords(commentText); // Фільтрація коментаря від нецензурних слів

    this.validationsService.validateExtraField(createCommentDto, [
      'commentText',
    ]); // Валідація додаткових полів DTO

    // Створення коментаря у базі даних
    return this.prismaService.comment.create({
      data: {
        commentText: filteredCommentText, // Текст коментаря після фільтрації
        order: { connect: { id: Number(orderId) } }, // Посилання на замовлення
        user: { connect: { id: Number(userId) } }, // Посилання на користувача
      },
    });
  }

  // Отримання всіх коментарів
  async getAllComments() {
    return this.prismaService.comment.findMany({
      select: {
        commentText: true,
        userId: true,
        orderId: true,
      },
    });
  }
}
