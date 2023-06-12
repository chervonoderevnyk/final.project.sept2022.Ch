import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Orders } from '@prisma/client';

import { CreateOrderDto } from './dto/create.order.dto';
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

  // async getAllOrders(page: number, limit: number) {
  //   const skip = (page - 1) * limit;
  //
  //   const totalCount = await this.prismaService.orders.count();
  //
  //   const orders = await this.prismaService.orders.findMany({
  //     orderBy: {
  //       id: 'desc',
  //     },
  //     skip,
  //     take: limit,
  //     select: {
  //       id: true,
  //       name: true,
  //       surname: true,
  //       email: true,
  //       phone: true,
  //       age: true,
  //       course: true,
  //       course_format: true,
  //       course_type: true,
  //       status: true,
  //       sum: true,
  //       alreadyPaid: true,
  //       group: true,
  //       created_at: true,
  //       utm: true,
  //       msg: true,
  //       manager: true,
  //     },
  //   });
  //   return {
  //     data: orders,
  //     page,
  //     limit,
  //     totalCount,
  //   };
  // }

  // async getAllOrdersSort(
  //   sortField: string,
  //   sortOrder: 'asc' | 'desc',
  //   page: number,
  //   limit: number,
  // ) {
  //   const orders = await this.prismaService.orders.findMany({
  //     orderBy: {
  //       [sortField]: sortOrder,
  //     },
  //     skip: (page - 1) * limit,
  //     take: limit,
  //   });
  //
  //   return orders;
  // }

  async getAllOrders(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const totalCount = await this.prismaService.orders.count();

    const orders = await this.prismaService.orders.findMany({
      orderBy: {
        id: 'desc',
      },
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

  async getAllOrdersSort(
    { sortField, sortOrder }: { sortField: string; sortOrder: 'asc' | 'desc' },
    page: number,
    limit: number,
  ) {
    const orders = await this.prismaService.orders.findMany({
      orderBy: {
        [sortField]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return orders;
  }

  async createOrder(
    orderData: CreateOrderDto,
    userId: string,
  ): Promise<Orders> {
    const user = await this.checkUser(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} does not exist.`);
    }
    return this.prismaService.orders.create({
      data: {
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
        mentorId: user.id,
      },
    });
  }

  async getOrderById(orderId: string) {
    return this.prismaService.orders.findFirst({
      where: { id: Number(orderId) },
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
  }

  async updateOrder(orderId: string, updateOrderDto: UpdateOrderDto) {
    return this.prismaService.orders.update({
      where: { id: Number(orderId) },
      data: updateOrderDto,
    });
  }

  async deleteOrder(orderId: string) {
    await this.prismaService.orders.delete({
      where: { id: Number(orderId) },
    });
  }

  async checkUser(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} does not exist.`);
    }
    return user;
  }
}
