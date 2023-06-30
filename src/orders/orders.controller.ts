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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/guard/roles.enum';
import { PrismaService } from '../core/orm/prisma.service';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
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
    const userId = req.user.id;
    const user = await this.userService.getUserById(userId);

    if (!updateOrderDto.manager && user.lastName) {
      if (
        updateOrderDto.manager &&
        user.lastName &&
        updateOrderDto.manager === user.lastName
      ) {
        const order = await this.ordersService.getOrderById(orderId);
        if (order.manager !== user.lastName) {
          throw new UnauthorizedException(
            'Ви не маєте дозволу на зміну цієї заявки',
          );
        }
      }

      updateOrderDto.manager = user.lastName || updateOrderDto.manager;
    }

    const order = await this.ordersService.updateOrder(
      orderId,
      updateOrderDto,
      user,
    );
    return order;
  }

  @Get('/:orderId/details')
  @ApiParam({ name: 'orderId', required: true })
  async getOrderDetails(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderDetails(orderId);
  }
}
