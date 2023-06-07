import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/guard/roles.enum';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @Get()
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async getAllOrders(@Query('page') page = 1, @Query('limit') limit = 25) {
    return this.ordersService.getAllOrders(page, limit);
  }

  @Get()
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async getAllOrdersSort(
    @Query('sortField') sortField = 'id',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 25,
  ) {
    const orders = await this.ordersService.getAllOrdersSort(
      sortField,
      sortOrder,
      page,
      limit,
    );

    return orders;
  }

  @Post('/:userId')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async createOrders(
    @Req() req: any,
    @Body() orderData: CreateOrderDto,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `User with id: ${userId} not fount` });
    }
    return this.ordersService.createOrder(
      {
        id: orderData.id,
        name: orderData.name,
        surname: orderData.surname,
        email: orderData.email,
        phone: orderData.phone,
        age: orderData.age,
        course: orderData.course,
        course_format: orderData.course_format,
        course_type: orderData.course_type,
        status: orderData.status,
        sum: orderData.sum,
        alreadyPaid: orderData.alreadyPaid,
        group: orderData.group,
        created_at: orderData.created_at,
        utm: orderData.utm,
        msg: orderData.msg,
        manager: orderData.manager,
      },
      userId,
    );
  }

  @Get('/:orderId')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiParam({ name: 'orderId', required: true })
  async getUserInfo(
    @Req() req: any,
    @Res() res: any,
    @Param('orderId') orderId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.getOrderById(orderId));
  }

  @Patch('/:orderId')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  updateProduct(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(orderId, updateOrderDto);
  }

  @Delete('/:orderId')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async deleteOrder(@Param('orderId') orderId: string) {
    await this.ordersService.deleteOrder(orderId);
  }
}
