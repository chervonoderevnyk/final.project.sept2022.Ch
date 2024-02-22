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
import { OrdersService } from '../orders/orders.service';
import { CreateCommentDto } from './dto/create.comment.dto';
import { CommentService } from './comment.service';
import { Role } from '../auth/guard/roles.enum';
import { ValidationsService } from '../core/validations/validations.service';
import { Status } from '@prisma/client';

// Додання тегів Swagger для документації API
@ApiTags('Comments')
@Controller('comments')
@UseGuards(AuthGuard()) // Застосування захисту аутентифікації до контролера
export class CommentController {
  constructor(
    // Впровадження залежностей для взаємодії з...
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly commentService: CommentService,
    private readonly validationsService: ValidationsService,
  ) {}

  // POST-точка для створення нового коментаря до певного замовлення
  @Post(':orderId/comment')
  @ApiOperation({ summary: 'Create a new comment for an order' })
  @UseGuards(AuthGuard()) // Додання захисту аутентифікації
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER]) // Встановлення метаданих ролей
  async createComment(
    @Param('orderId') orderId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    try {
      // Отримання інформації про замовлення та користувача
      const order = await this.ordersService.getOrderById(orderId);
      const user = await this.userService.getUserById(req.user.id);

      this.validationsService.validateManagerPermission(order, user, {}); // Перевірка прав менеджера для замовлення

      const createdComment = await this.commentService.createComment(
        orderId,
        createCommentDto,
        req.user.id,
      ); // Створення нового коментаря

      await this.ordersService.updateOrderManager(
        orderId,
        String(user.id),
        user.lastName,
      ); // Оновлення інформації про менеджера та статусу замовлення

      await this.ordersService.updateOrderStatus(orderId, Status.In_work);

      return createdComment; // Повернення створеного коментаря
    } catch (error) {
      // Обробка помилок з відповідним HTTP-відгуком
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

  // GET-точка для отримання всіх коментарів
  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  getAllComments() {
    return this.commentService.getAllComments(); // Отримання та повернення всіх коментарів
  }
}
