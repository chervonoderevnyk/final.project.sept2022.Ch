import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { CreateUserByAdminDto } from './dto/create.users.admin.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { RoleGuard } from '../auth/guard/roles.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard(), RoleGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('create-by-admin')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  async createUserByAdmin(
    @Req() req: any,
    @Body() createUserByAdminDto: CreateUserByAdminDto,
    @Res() res: any,
  ) {
    try {
      const user = await this.userService.registerUserByAdmin(
        createUserByAdminDto,
      );
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get()
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  async getUserList(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json(await this.userService.getUserList());
  }

  @ApiParam({ name: 'userId', required: true })
  @Get('/:userId')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
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
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    try {
      const user = req.user;
      const isAdmin = user.roles === Role.Admin;
      const isUserSelfUpdate = userId === user.id.toString();

      if (isAdmin || isUserSelfUpdate) {
        const updatedUser = await this.userService.updateUser(
          userId,
          updateUserDto,
        );
        const userWithoutPassword = { ...updatedUser, password: undefined };
        return res.status(HttpStatus.OK).json(userWithoutPassword);
      } else {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'Недостатні права для редагування користувача' });
      }
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('/:userId')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
