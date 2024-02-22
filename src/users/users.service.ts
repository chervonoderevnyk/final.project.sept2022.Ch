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

type UsersWithoutPassword = Omit<Users, 'password'>; // Користувач без пароля

@Injectable()
export class UsersService {
  private salt = 6; // Сіль для хешування паролів
  private readonly itemsPerPage = 2; // Кількість елементів на сторінці
  constructor(private readonly prismaService: PrismaService) {}

  // Реєстрація користувача адміністратором
  async registerUserByAdmin(userData: CreateUserByAdminDto): Promise<Users> {
    const email = userData.email === '' ? null : userData.email; // Перевірка та обробка електронної пошти

    // Створення користувача
    const user = await this.prismaService.users.create({
      data: {
        lastName: userData.lastName,
        firstName: userData.firstName,
        email: email,
        password: '', // Пароль буде заданий пізніше
        roles: Role.Manager,
      },
    });

    delete user.password; // Видалення пароля перед поверненням

    return user; // Повернення створеного користувача
  }

  // Активація користувача
  async activateUser(userId: number, password: string): Promise<Users> {
    const user = await this.prismaService.users.findUnique({
      where: { id: userId },
    }); // Пошук користувача

    if (!user) {
      throw new Error('Користувач не знайдений');
    } // Перевірка наявності користувача

    // Оновлення даних користувача
    const updatedUser = await this.prismaService.users.update({
      where: { id: userId },
      data: {
        password: await this.hashPassword(password), // Хешування пароля
        active: true, // Активний статус користувача
      },
    });

    delete updatedUser.password; // Видалення пароля перед поверненням

    return updatedUser; // Повернення оновленого користувача
  }

  // Хешування пароля
  async hashPassword(password: string) {
    return bcrypt.hash(password, this.salt); // Повернення хешованого пароля
  }

  // Отримання списку користувачів
  async getUserList(
    page = 1,
  ): Promise<{ users: UsersWithoutPassword[]; totalCount: number }> {
    const skip = (page - 1) * this.itemsPerPage; // Пропуск елементів

    // Отримання списку користувачів
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

    const totalCount = await this.prismaService.users.count(); // Підрахунок загальної кількості користувачів

    // Обробка списку користувачів
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

  // Отримання користувача за ідентифікатором
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
    } // Перевірка наявності користувача

    const orderCount = await this.prismaService.orders.count({
      where: {
        managerId: user.id,
      },
    }); // Підрахунок кількості замовлень

    const orders = {
      count: orderCount,
      list: user.orders,
    }; // Замовлення користувача

    return {
      ...user,
      orders,
    };
  }

  // Оновлення даних користувача
  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    user: any,
  ): Promise<Users> {
    const isAdmin = user.roles === Role.Admin; // Перевірка на адміністратора
    const isUserSelfUpdate = userId === user.id.toString(); // Перевірка на оновлення власного користувача

    if (!isAdmin && !isUserSelfUpdate) {
      throw new HttpException(
        'Недостатні права для редагування користувача',
        HttpStatus.FORBIDDEN,
      );
    } // Перевірка прав доступу

    const { lastName, firstName, email, roles } = updateUserDto; // Оновлені дані користувача
    const updatedUser = await this.prismaService.users.update({
      where: { id: Number(userId) },
      data: { lastName, firstName, email, roles },
    }); // Оновлення користувача

    delete updatedUser.password; // Видалення пароля перед поверненням

    return updatedUser;
  }

  // Видалення користувача
  async deleteUser(userId: string) {
    const user = await this.prismaService.users.findUnique({
      where: { id: Number(userId) },
      select: { id: true, lastName: true },
    });

    if (!user) {
      throw new NotFoundException('Користувача не знайдено');
    }

    await this.prismaService.users.delete({
      where: { id: Number(userId) },
    });

    return `Користувача з ідентифікатором ${user.id} та прізвищем ${user.lastName} видалено!!!`;
  }

  // Пошук користувача за електронною поштою
  async findUserByEmail(userEmail: string) {
    return await this.prismaService.users.findFirst({
      where: { email: userEmail },
    }); // Пошук користувача за електронною поштою
  }

  // Оновлення пароля користувача
  async updateUserPassword(
    userId: string, // Ідентифікатор користувача
    newPassword: string, // Новий пароль
  ): Promise<Users> {
    const hashedPassword = await this.hashPassword(newPassword); // Хешування пароля

    const updatedUser = await this.prismaService.users.update({
      where: { id: Number(userId) },
      data: { password: hashedPassword },
    }); // Оновлення пароля користувача

    delete updatedUser.password; // Видалення пароля перед поверненням

    return updatedUser; // Повернення оновленого користувача
  }
}
