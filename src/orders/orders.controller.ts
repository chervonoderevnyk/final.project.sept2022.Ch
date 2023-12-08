import {
  BadRequestException,
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

import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/guard/roles.enum';
import { ValidationsService } from '../core/validations/validations.service';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(AuthGuard())
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly validationsService: ValidationsService,
  ) {}

  @Get()
  async getAllOrders(
    @Query('sort') sort: string,
    @Query('page') page = '1',
    @Query('limit') limit = '25',
  ) {
    const pageNumber = parseInt(page, 10);
    if (isNaN(pageNumber) || pageNumber < 1 || !/^\d+$/.test(page)) {
      throw new BadRequestException('Некоректне значення для параметра "page"');
    }

    const limitNumber = parseInt(limit, 10);
    if (isNaN(limitNumber) || limitNumber < 1 || !/^\d+$/.test(limit)) {
      throw new BadRequestException(
        'Некоректне значення для параметра "limit"',
      );
    }

    let sortField: string | undefined;
    let sortOrder: 'asc' | 'desc' | undefined;

    if (sort) {
      if (!/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ-]+$/.test(sort)) {
        throw new BadRequestException(
          'Некоректне значення для параметра "sort"',
        );
      }

      if (sort.startsWith('-')) {
        sortField = sort.substring(1);
        sortOrder = 'desc';
      } else {
        sortField = sort;
        sortOrder = 'asc';
      }

      const validSortFields = [
        'id',
        'name',
        'surname',
        'email',
        'phone',
        'age',
        'course',
        'course_format',
        'course_type',
        'status',
        'sum',
        'alreadyPaid',
        'group',
        'created_at',
        'manager',
      ];

      if (!validSortFields.includes(sortField)) {
        throw new BadRequestException(
          'Некоректне значення для параметра "sort"',
        );
      }
    }

    return this.ordersService.getAllOrders(
      pageNumber,
      limitNumber,
      sortField,
      sortOrder,
    );
  }

  @Get('/:orderId')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiParam({ name: 'orderId', required: true })
  async getOrderInfo(
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
    const order = await this.ordersService.getOrderById(orderId);

    this.validationsService.validateUpdateOrder(updateOrderDto, order, user);

    updateOrderDto.manager = order.manager || user.lastName;

    const updatedOrder = await this.ordersService.updateOrder(
      orderId,
      updateOrderDto,
      user,
    );
    return updatedOrder;
  }

  @Get('/:orderId/details')
  @ApiParam({ name: 'orderId', required: true })
  async getOrderDetails(@Param('orderId') orderId: string) {
    return this.ordersService.getOrderDetails(orderId);
  }
}
