import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderDto } from '../orders/dto/update.order.dto';
import { ValidationsService } from '../core/validations/validations.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly ordersService: OrdersService,
    private readonly validationsService: ValidationsService,
  ) {}

  async createOrUpdateGroup(
    orderId: string,
    createGroupDto: CreateGroupDto,
    user: any,
  ) {
    const updateOrderDto = new UpdateOrderDto();

    const order = await this.ordersService.getOrderById(orderId);

    this.validationsService.validateLastName(updateOrderDto, order, user);

    if (!updateOrderDto.manager && user.lastName) {
      updateOrderDto.manager = user.lastName || updateOrderDto.manager;
    }

    updateOrderDto.managerInfo = { lastName: user.lastName, id: user.id };

    const existingGroup = await this.prismaService.group.findFirst({
      where: {
        title: createGroupDto.title,
      },
    });

    if (existingGroup) {
      updateOrderDto.group = existingGroup;
    } else {
      const newGroup = await this.createGroup(createGroupDto);
      updateOrderDto.group = newGroup;
    }

    await this.ordersService.updateOrder(orderId, updateOrderDto, user);

    return updateOrderDto.group;
  }

  async createGroup(createGroupDto: CreateGroupDto) {
    const { title } = createGroupDto;
    return this.prismaService.group.create({
      data: {
        title,
      },
    });
  }

  async getAllGroups() {
    return this.prismaService.group.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
