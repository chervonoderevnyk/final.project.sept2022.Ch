import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../core/orm/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { Role, Users } from '@prisma/client';
import { CreateUserByAdminDto } from './dto/create.users.admin.dto';

type UsersWithoutPassword = Omit<Users, 'password'>;

@Injectable()
export class UsersService {
  private salt = 6;
  private readonly itemsPerPage = 2;
  constructor(private readonly prismaService: PrismaService) {}

  async registerUserByAdmin(userData: CreateUserByAdminDto): Promise<Users> {
    const email = userData.email === '' ? null : userData.email;

    const user = await this.prismaService.users.create({
      data: {
        lastName: userData.lastName,
        firstName: userData.firstName,
        email: email,
        password: '',
        roles: Role.Manager,
      },
    });

    delete user.password;

    return user;
  }

  async activateUser(userId: number, password: string): Promise<Users> {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Користувач не знайдений');
    }

    const updatedUser = await this.prismaService.users.update({
      where: { id: userId },
      data: {
        password: await this.hashPassword(password),
        active: true,
      },
    });

    delete updatedUser.password;

    return updatedUser;
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, this.salt);
  }

  async getUserList(
    page = 1,
  ): Promise<{ users: UsersWithoutPassword[]; totalCount: number }> {
    const skip = (page - 1) * this.itemsPerPage;

    const users = await this.prismaService.users.findMany({
      take: this.itemsPerPage,
      skip,
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        roles: true,
        active: true,
        orders: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    const totalCount = await this.prismaService.users.count();

    const usersWithOrderCount = await Promise.all(
      users.map(async (user) => {
        const orderCount = await this.prismaService.orders.count({
          where: {
            managerId: user.id,
          },
        });

        const statusCounts = user.orders.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});

        return {
          ...user,
          orders: {
            count: orderCount,
            statusCounts,
          },
        };
      }),
    );

    return { users: usersWithOrderCount, totalCount };
  }

  async getUserById(userId: string) {
    const user = await this.prismaService.users.findFirst({
      where: { id: Number(userId) },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        password: true,
        roles: true,
        active: true,
        orders: {
          select: {
            id: true,
            email: true,
            phone: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('Користувач не знайдений', HttpStatus.NOT_FOUND);
    }

    const orderCount = await this.prismaService.orders.count({
      where: {
        managerId: user.id,
      },
    });

    const orders = {
      count: orderCount,
      list: user.orders,
    };

    return {
      ...user,
      orders,
    };
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    const { lastName, firstName, email, roles } = updateUserDto;
    const updatedUser = await this.prismaService.users.update({
      where: { id: Number(userId) },
      data: { lastName, firstName, email, roles },
    });

    delete updatedUser.password;

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: Number(userId) },
      select: { id: true, lastName: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prismaService.users.delete({
      where: { id: Number(userId) },
    });

    return `User with id ${user.id} and lastName ${user.lastName} deleted!!!`;
  }

  async findUserByEmail(userEmail: string) {
    return await this.prismaService.users.findFirst({
      where: { email: userEmail },
    });
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<Users> {
    const hashedPassword = await this.hashPassword(newPassword);

    const updatedUser = await this.prismaService.users.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword },
    });

    delete updatedUser.password;

    return updatedUser;
  }
}
