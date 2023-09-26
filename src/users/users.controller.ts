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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create.users.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update.user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard())
  async registerUserByAdmin(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
    @Res() res: any,
  ) {
    try {
      const user = await this.userService.registerUserByAdmin(createUserDto);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  async getUserList(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json(await this.userService.getUserList());
  }

  @ApiParam({ name: 'userId', required: true })
  @Get('/:userId')
  @UseGuards(AuthGuard())
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
  ) {
    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDto,
      );
      const userWithoutPassword = { ...updatedUser, password: undefined };
      return res.status(HttpStatus.OK).json(userWithoutPassword);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @Delete('/:userId')
  @UseGuards(AuthGuard())
  deleteUser(@Param('userId') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
