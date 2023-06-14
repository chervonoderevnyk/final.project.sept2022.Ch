import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../core/orm/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/create.users.dto';

@Injectable()
export class UsersService {
  private salt = 6;

  constructor(private readonly prismaService: PrismaService) {}
  async registerUserByAdmin(userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.findUserByEmail(userData.email);
    if (findUser) {
      throw new Error('Користувач з такою електронною поштою вже існує');
    }

    const passwordHash = await this.hashPassword(userData.password);
    return this.prismaService.user.create({
      data: {
        lastName: userData.lastName,
        firstName: userData.firstName,
        email: userData.email,
        password: passwordHash,
        roles: Role.Manager,
      },
    });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, this.salt);
  }

  async getUserList() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        orders: true,
        roles: true,
      },
    });
  }

  async getUserById(userId: string) {
    return this.prismaService.user.findFirst({
      where: { id: Number(userId) },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        orders: true,
        password: true,
        roles: true,
      },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { lastName, firstName, email, roles } = updateUserDto;
    return this.prismaService.user.update({
      where: { id: Number(userId) },
      data: { lastName, firstName, email, roles },
    });
  }

  async deleteUser(userId: string) {
    return this.prismaService.user.delete({
      where: { id: Number(userId) },
    });
  }

  async findUserByEmail(userEmail: string) {
    return this.prismaService.user.findFirst({
      where: { email: userEmail },
    });
  }
}
