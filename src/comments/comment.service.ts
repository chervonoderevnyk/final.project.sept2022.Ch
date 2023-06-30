import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { UsersService } from '../users/users.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async createComment(
    orderId: string,
    createCommentDto: CreateCommentDto,
    userId: string,
  ) {
    const { commentText } = createCommentDto;
    return this.prismaService.comment.create({
      data: {
        commentText,
        order: { connect: { id: Number(orderId) } },
        user: { connect: { id: Number(userId) } },
      },
    });
  }
}
