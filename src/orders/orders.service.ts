import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Status } from '@prisma/client';

import { PrismaService } from '../core/orm/prisma.service';
import { UpdateOrderDto } from './dto/update.order.dto';
import { ValidationsService } from '../core/validations/validations.service';
import { GroupService } from '../groups/group.service';

@Injectable()
export class OrdersService {
  [x: string]: any;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationsService: ValidationsService,
    private readonly groupService: GroupService,
  ) {}

  async getAllOrders(sort: string, page: string, limit: string) {
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

    const skip = (pageNumber - 1) * limitNumber;
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
      take: limitNumber,
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
      page: pageNumber,
      limit: limitNumber,
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

    this.validationsService.validateExtraField(updateOrderDto, [
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
      'utm',
      'msg',
      'manager',
    ]);

    if (updateOrderDto.group) {
      const existingGroup = await this.groupService.getGroupById(
        updateOrderDto.group.title,
      );

      if (!existingGroup) {
        const availableGroups = await this.groupService.getAllGroups();
        const groupsList = availableGroups
          .map((group) => group.title)
          .join(', ');

        throw new NotFoundException({
          message: `Група з назвою '${updateOrderDto.group.title}' не існує.`,
          availableGroups: `Групи: ${groupsList}`,
        });
      }
    }

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

    return this.prismaService.orders.update({
      where: { id: Number(orderId) },
      data: updatedOrderData,
      include: {
        managerInfo: {
          select: {
            id: true,
            lastName: true,
            firstName: true,
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
    let managerData = {};
    if (updateOrderDto.status === Status.New) {
      managerData = {
        managerId: null,
      };
    } else {
      managerData = {
        manager: user.lastName,
        managerId: user.id,
      };
    }

    return {
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
      group: updateOrderDto.group?.title || order.group.title,
      created_at: updateOrderDto.created_at,
      ...managerData,
    };
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
}
