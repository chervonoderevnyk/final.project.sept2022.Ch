import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserByAdminDto } from './dto/create.users.admin.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { RoleGuard } from '../auth/guard/roles.guard';
import { AuthService } from '../auth/auth.service';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard(), RoleGuard)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private authService: AuthService,
  ) {}

  // Метод POST для створення користувача адміністратором
  @Post('create-by-admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  @ApiOperation({ summary: 'Create user by admin' })
  async createUserByAdmin(
    @Req() req: any,
    @Body() createUserByAdminDto: CreateUserByAdminDto,
    @Res() res: any,
  ) {
    try {
      const existingUser = await this.userService.findUserByEmail(
        createUserByAdminDto.email, // Пошук існуючого користувача за email
      );
      if (existingUser) {
        throw new ConflictException('Користувач з вказаним email вже існує!');
      }

      const user = await this.userService.registerUserByAdmin(
        createUserByAdminDto, // Реєстрація користувача адміністратором
      );

      const accessToken = this.authService.generateAccessTokenActivate(
        user.id.toString(), // Генерація токену доступу
      );

      return res.status(HttpStatus.CREATED).json({ user, accessToken }); // Повертає успішну відповідь з користувачем та токеном доступу
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message }); // Повертає помилку при невдалому створенні користувача
    }
  }

  // Метод GET для отримання списку користувачів
  @Get()
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  @ApiOperation({ summary: 'Get user list' })
  async getUserList(@Req() req: any, @Res() res: any, @Query('page') page = 1) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.getUserList(page));
  }

  @ApiParam({ name: 'userId', required: true })
  @Get('/:userId')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  @ApiOperation({ summary: 'Get user information by ID' })
  async getUserInfo(
    @Req() req: any,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    const user = await this.userService.getUserById(String(userId)); // Отримання користувача за його ID
    const userWithoutPassword = { ...user, password: undefined }; // Видалення паролю з відповіді
    return res.status(HttpStatus.OK).json(userWithoutPassword); // Повертає інформацію про користувача без пароля
  }

  // Метод PATCH для оновлення користувача за його ID
  @Patch('/:userId')
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Update user by ID' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDto,
        req.user, // Користувач, який оновлює дані
      );
      return res.status(HttpStatus.OK).json(updatedUser); // Повертає оновленого користувача
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message }); // Повертає помилку при невдалому оновленні користувача
    }
  }

  // Метод DELETE для видалення користувача за його ID
  @Delete('/:userId')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  @ApiOperation({ summary: 'Delete user by ID' })
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
