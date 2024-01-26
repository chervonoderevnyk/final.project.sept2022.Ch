import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UsersService } from '../users/users.service';
import { PrismaService } from '../core/orm/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderDto } from '../orders/dto/update.order.dto';
import { CreateCommentDto } from './dto/create.comment.dto';
import { CommentService } from './comment.service';
import { Role } from '../auth/guard/roles.enum';

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
  @ApiOperation({ summary: 'Create a new comment for an order' })
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async createComment(
    @Param('orderId') orderId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    try {
      const updateOrderDto = new UpdateOrderDto();

      const order = await this.ordersService.getOrderById(orderId);
      const user = await this.userService.getUserById(req.user.id);

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

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  getAllComments() {
    return this.commentService.getAllComments();
  }
}
