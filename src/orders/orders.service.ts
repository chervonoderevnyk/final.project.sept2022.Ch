import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { UpdateOrderDto } from './dto/update.order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async getAllOrders(
    page: number,
    limit: number,
    sortField?: string,
    sortOrder?: 'asc' | 'desc',
  ) {
    const skip = (page - 1) * limit;
    const totalCount = await this.prismaService.orders.count();

    const orderBy: any = {};

    if (sortField && sortOrder) {
      orderBy[sortField] = sortOrder;
    } else {
      orderBy.id = 'desc';
    }

    const orders = await this.prismaService.orders.findMany({
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        phone: true,
        age: true,
        course: true,
        course_format: true,
        course_type: true,
        status: true,
        sum: true,
        alreadyPaid: true,
        group: true,
        created_at: true,
        utm: true,
        msg: true,
        manager: true,
      },
    });

    return {
      data: orders,
      page,
      limit,
      totalCount,
    };
  }

  async getOrderById(orderId: string) {
    return this.prismaService.orders.findFirst({
      where: { id: Number(orderId) },
      select: {
        name: true,
        surname: true,
        email: true,
        phone: true,
        age: true,
        course: true,
        course_format: true,
        course_type: true,
        status: true,
        sum: true,
        alreadyPaid: true,
        group: true,
        created_at: true,
        utm: true,
        msg: true,
        manager: true,
      },
    });
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    manager: User,
  ) {
    const order = await this.prismaService.orders.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order) {
      throw new NotFoundException('Замовлення не знайдено');
    }

    if (order.manager !== manager.lastName) {
      throw new ForbiddenException(
        'У вас немає дозволу оновлювати це замовлення',
      );
    }

    const updatedData: any = {};

    if (Object.keys(updateOrderDto).length > 0) {
      updatedData.status = 'В роботі';

      for (const field in updateOrderDto) {
        if (
          updateOrderDto[field] !== null &&
          updateOrderDto[field] !== undefined
        ) {
          updatedData[field] = updateOrderDto[field];
        }
      }
    }

    if (manager) {
      updatedData.manager = manager.lastName || manager.id.toString();
    }

    if (
      updateOrderDto.created_at !== null &&
      updateOrderDto.created_at !== undefined
    ) {
      try {
        const createdAt = new Date(updateOrderDto.created_at);
        if (isNaN(createdAt.getTime())) {
          throw new Error('Некоректне значення поля created_at');
        }
        updatedData.created_at = createdAt.toISOString();
      } catch (error) {
        throw new BadRequestException(error.message);
      }
    }

    return this.prismaService.orders.update({
      where: { id: Number(orderId) },
      data: updatedData,
    });
  }
}
