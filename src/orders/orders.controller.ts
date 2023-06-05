import {
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { UsersService } from '../users/users.service';
import { SortOrderByInput } from './dto/get.order.dto';

@ApiTags('Orders')
@Controller('orders')
// @UseGuards(RolesGuard)
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @Get()
  async findAllOrdersPaginate(
    @Query('page') page = 1,
    @Query('limit') limit = 25,
  ) {
    return this.ordersService.findAllPaginate(page, limit);
  }

  @Get()
  async findAllOrders(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json(await this.ordersService.findAll());
  }

  // @Post()
  // async createOrders(
  //   @Req() req: any,
  //   @Body() body: CreateOrderDto,
  //   @Res() res: any,
  // ) {
  //   return res
  //     .status(HttpStatus.CREATED)
  //     .json(await this.ordersService.createOrder(body));
  // }

  @Post('/:userId')
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
  // @Roles('admin')
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
  @ApiParam({ name: 'orderId', required: true })
  async updateOrder(
    @Req() req: any,
    @Res() res: any,
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(orderId, updateOrderDto);
  }

  @Delete('/:orderId')
  async deleteOrder(
    @Req() req: any,
    @Res() res: any,
    @Param('orderId') orderId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.ordersService.deleteOrder(orderId));
  }
}
