import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { ValidationsService } from '../core/validations/validations.service';

@Injectable()
export class OrdersService {
  [x: string]: any;

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly validationsService: ValidationsService,
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
        manager: true,
        managerInfo: {
          select: {
            id: true,
            lastName: true,
          },
        },
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
        managerInfo: {
          select: {
            id: true,
            lastName: true,
          },
        },
      },
    });
  }

  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
    user: any,
  ) {
    const order = await this.prismaService.orders.findUnique({
      where: { id: Number(orderId) },
      include: {
        managerInfo: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Заявка не знайдена');
    }

    const isAdminOrManager =
      user.roles === Role.Admin || user.roles === Role.Manager;

    this.validationsService.validateUpdateOrderData(
      updateOrderDto,
      order,
      user,
    );

    if (updateOrderDto.status === undefined || updateOrderDto.status === null) {
      updateOrderDto.status = Status.In_work;
    }

    const updatedOrderData = this.buildUpdateOrderData(
      updateOrderDto,
      order,
      user,
    );

    const updatedOrder = await this.prismaService.orders.update({
      where: { id: Number(orderId) },
      data: updatedOrderData,
      include: {
        managerInfo: {
          select: {
            id: true,
            email: true,
            lastName: true,
            firstName: true,
            roles: true,
          },
        },
      },
    });

    return updatedOrder;
  }

  async getOrderDetails(orderId: string) {
    return this.prismaService.orders.findFirst({
      where: { id: Number(orderId) },
      select: {
        msg: true,
        utm: true,
        comments: {
          select: {
            id: true,
            commentText: true,
            createdAt: true,
            user: {
              select: {
                lastName: true,
                firstName: true,
              },
            },
          },
        },
      },
    });
  }

  private buildUpdateOrderData(
    updateOrderDto: UpdateOrderDto,
    order: any,
    user: any,
  ) {
    const updatedOrderData = {
      name: updateOrderDto.name,
      surname: updateOrderDto.surname,
      email: updateOrderDto.email,
      phone: updateOrderDto.phone,
      age: updateOrderDto.age,
      course: updateOrderDto.course,
      course_format: updateOrderDto.course_format,
      course_type: updateOrderDto.course_type,
      status: updateOrderDto.status,
      sum: updateOrderDto.sum,
      alreadyPaid: updateOrderDto.alreadyPaid,
      group: updateOrderDto.group?.title || order.group,
      created_at: updateOrderDto.created_at,
      manager: user.lastName,
      managerInfo: {
        connect: { id: user.id },
      },
    };

    return updatedOrderData;
  }
}
