import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { ValidationsService } from '../core/validations/validations.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationsService: ValidationsService,
  ) {}

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
    }

    const filteredCommentText =
      this.validationsService.checkForBadWords(commentText);
    this.validationsService.validateExtraField(createCommentDto, [
      'commentText',
    ]);
    return this.prismaService.comment.create({
      data: {
        commentText: filteredCommentText,
        order: { connect: { id: Number(orderId) } },
        user: { connect: { id: Number(userId) } },
      },
    });
  }

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
