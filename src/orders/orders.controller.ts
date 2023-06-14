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
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';

import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/guard/roles.enum';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  @Get()
  async getAllOrders(
    @Query('sort') sort: string,
    @Query('page') page = 1,
    @Query('limit') limit = 25,
  ) {
    let sortField: string | undefined;
    let sortOrder: 'asc' | 'desc' | undefined;

    if (sort) {
      if (sort.startsWith('-')) {
        sortField = sort.substring(1);
        sortOrder = 'desc';
      } else {
        sortField = sort;
        sortOrder = 'asc';
      }
    }

    return this.ordersService.getAllOrders(page, limit, sortField, sortOrder);
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
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async updateOrder(
    @Param('orderId') orderId: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req: any,
  ) {
    const manager: User = req.user;
    const updatedOrder = await this.ordersService.updateOrder(
      orderId,
      updateOrderDto,
      manager,
    );
    return updatedOrder;
  }
}
