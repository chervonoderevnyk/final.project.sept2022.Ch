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
import { SortOrderByInput } from './dto/get.order.dto';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async findAllPaginate(page: number, limit: number) {
    return this.prismaService.orders.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        // surname: true,
        // email: true,
        // phone: true,
        age: true,
        // course: true,
        // course_format: true,
        // course_type: true,
        // status: true,
        // sum: true,
        // alreadyPaid: true,
        // group: true,
        // created_at: true,
        // utm: true,
        // msg: true,
        // manager: true,
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });
  }

  async findAll(): Promise<Orders[]> {
    return this.prismaService.orders
      .findMany
      //   {
      //   select: {
      //     id: true,
      //     name: true,
      //     surname: true,
      //     email: true,
      //     phone: true,
      //     age: true,
      //     course: true,
      //     course_format: true,
      //     course_type: true,
      //     status: true,
      //     sum: true,
      //     alreadyPaid: true,
      //     // group: true,
      //     created_at: true,
      //     utm: true,
      //     msg: true,
      // manager: true,
      //   },
      // }
      ();
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

  async updateOrder(orderId: string, UpdateOrderDto): Promise<Orders> {
    return this.prismaService.orders.update({
      where: { id: Number(orderId) },
      data: UpdateOrderDto,
    });
  }

  async deleteOrder(orderId: string) {
    return this.prismaService.orders.delete({ where: { id: Number(orderId) } });
  }

  async checkUser(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ${userId} does not exist.`);
    }
    return user;
  }
}
