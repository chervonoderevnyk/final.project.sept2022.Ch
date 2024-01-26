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
import { Role } from '@prisma/client';

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
        createUserByAdminDto.email,
      );
      if (existingUser) {
        throw new ConflictException('Користувач з вказаним email вже існує!');
      }

      const user = await this.userService.registerUserByAdmin(
        createUserByAdminDto,
      );

      const accessToken = this.authService.generateAccessTokenActivate(
        user.id.toString(),
      );

      return res.status(HttpStatus.CREATED).json({ user, accessToken });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

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
    const user = await this.userService.getUserById(String(userId));
    const userWithoutPassword = { ...user, password: undefined };
    return res.status(HttpStatus.OK).json(userWithoutPassword);
  }

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
        req.user,
      );
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('/:userId')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  @ApiOperation({ summary: 'Delete user by ID' })
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
