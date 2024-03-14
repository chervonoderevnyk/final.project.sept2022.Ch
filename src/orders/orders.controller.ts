import {
  Body,
  Controller,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/guard/roles.enum';
import { ValidationsService } from '../core/validations/validations.service';

@ApiTags('Orders') // Теги для Swagger
@Controller('orders') // Контролер для маршруту /orders
@UseGuards(AuthGuard()) // Застосовання обмеження автентифікації для всіх методів
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService, // Впровадження залежностей для взаємодії з сервісом замовлень
    @Inject(forwardRef(() => UsersService)) // Впровадження залежностей для взаємодії з сервісом користувачів
    private readonly userService: UsersService,
    private readonly validationsService: ValidationsService, // Впровадження залежностей для валідації даних
  ) {}

  // Отримання всіх замовлень з можливістю сортування та пагінації
  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async getAllOrders(
    @Query('sort') sort: string, // Сортування
    @Query('page') page = '1', // Сторінка
    @Query('limit') limit = '25', // Ліміт
  ) {
    return this.ordersService.getAllOrders(sort, page, limit);
  }

  // Отримання інформації про замовлення за його ID
  @Get('/:orderId')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiParam({ name: 'orderId', required: true })
  @ApiOperation({ summary: 'Get order information by ID' })
  async getOrderInfo(
    @Req() req: any, // Запит
    @Res() res: any, // Відповідь
    @Param('orderId') orderId: string, // ID замовлення
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.getOrderById(orderId));
  }

  // Оновлення замовлення за його ID
  @Patch('/:orderId')
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiOperation({ summary: 'Update order by ID' })
  async updateOrder(
    @Param('orderId') orderId: string, // ID замовлення
    @Body() updateOrderDto: UpdateOrderDto, // DTO для оновлення замовлення
    @Req() req: any, // Запит
  ) {
    // Отримання ідентифікатора та інформації про користувача
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);

    // Отримання інформації про замовлення та перевірка валідності оновлення
    const order = await this.ordersService.getOrderById(orderId);
    this.validationsService.validateUpdateOrder(updateOrderDto, order, user);

    // Оновлення менеджера та виклик сервісу для збереження змін
    updateOrderDto.manager = order.manager || user.lastName;
    return await this.ordersService.updateOrder(orderId, updateOrderDto, user);
  }

  // Отримання деталей замовлення за його ідентифікатором
  @Get('/:orderId/details')
  @ApiParam({ name: 'orderId', required: true })
  @ApiOperation({ summary: 'Get order details by ID' })
  async getOrderDetails(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderDetails(orderId);
  }
}
