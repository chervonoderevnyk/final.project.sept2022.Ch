import {
  Body,
  Controller,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../core/orm/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderDto } from '../orders/dto/update.order.dto';
import { CreateCommentDto } from './dto/create.comment.dto';
import { CommentService } from './comment.service';

@ApiTags('Comments')
@Controller('comments')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly commentService: CommentService,
  ) {}

  @Post(':orderId/comment')
  async createComment(
    @Param('orderId') orderId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    try {
      const updateOrderDto = new UpdateOrderDto();

      const order = await this.ordersService.getOrderById(orderId);
      const user = await this.userService.getUserById(req.user.id);

      if (!updateOrderDto.manager && user.lastName) {
        updateOrderDto.manager = user.lastName || updateOrderDto.manager;
      }

      await this.ordersService.updateOrder(orderId, updateOrderDto, user);

      return this.commentService.createComment(
        orderId,
        createCommentDto,
        req.user.id,
      );
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
