import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../core/orm/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { Role, Users } from '@prisma/client';
import { CreateUserDto } from './dto/create.users.dto';

@Injectable()
export class UsersService {
  private salt = 6;

  constructor(private readonly prismaService: PrismaService) {}
  async registerUserByAdmin(userData: CreateUserDto): Promise<Users> {
    const findUser: Users = await this.findUserByEmail(userData.email);
    if (findUser) {
      throw new Error('Користувач з такою електронною поштою вже існує');
    }

    const passwordHash = await this.hashPassword(userData.password);
    return this.prismaService.users.create({
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
    return this.prismaService.users.findMany({
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        roles: true,
        orders: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async getUserById(userId: string) {
    return this.prismaService.users.findFirst({
      where: { id: Number(userId) },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        password: true,
        roles: true,
        orders: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const { lastName, firstName, email, roles } = updateUserDto;
    return this.prismaService.users.update({
      where: { id: Number(userId) },
      data: { lastName, firstName, email, roles },
    });
  }

  async deleteUser(userId: string) {
    return this.prismaService.users.delete({
      where: { id: Number(userId) },
    });
  }

  async findUserByEmail(userEmail: string) {
    return await this.prismaService.users.findFirst({
      where: { email: userEmail },
    });
  }
}
