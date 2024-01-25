import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

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
