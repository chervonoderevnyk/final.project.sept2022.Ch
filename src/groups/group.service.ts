import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { UpdateOrderDto } from '../orders/dto/update.order.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  async createGroup(
    orderId: string,
    createGroupDto: CreateGroupDto,
    userId: string,
  ) {
    const { title } = createGroupDto;
    return this.prismaService.group.create({
      data: {
        title,
        order: { connect: { id: Number(orderId) } },
        user: { connect: { id: Number(userId) } },
      },
    });
  }

  async deleteGroup(groupId: number) {
    return this.prismaService.group.delete({
      where: {
        id: groupId,
      },
    });
  }

  async updateGroup(groupId: number, title: string) {
    return this.prismaService.group.update({
      where: {
        id: groupId,
      },
      data: {
        title,
      },
    });
  }

  async getAllGroups() {
    return this.prismaService.group.findMany();
  }
}
