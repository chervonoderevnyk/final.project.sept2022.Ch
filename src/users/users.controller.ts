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

import { CreateUserDto } from './dto/create.users.dto';
import { UsersService } from './users.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update.user.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard())
// @Roles(Role.User)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // @Post()
  // async createUser(
  //   @Req() req: any,
  //   @Body() createUserDto: CreateUserDto,
  //   @Res() res: any,
  // ) {
  //   return res
  //     .status(HttpStatus.CREATED)
  //     .json(await this.userService.createUser(createUserDto));
  // }

  @Post()
  async registerUserByAdmin(
    @Req() req: any,
    @Body() createUserDto: CreateUserDto,
    @Res() res: any,
  ) {
    return res
      .status(HttpStatus.CREATED)
      .json(await this.userService.registerUserByAdmin(createUserDto));
  }

  @Get()
  @UseGuards(AuthGuard())
  async getUserList(@Req() req: any, @Res() res: any) {
    return res.status(HttpStatus.OK).json(await this.userService.getUserList());
  }

  @ApiParam({ name: 'userId', required: true })
  @Get('/:userId')
  async getUserInfo(
    @Req() req: any,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.getUserById(userId));
  }

  @Patch('/:userId')
  @ApiParam({ name: 'userId', required: true })
  async updateUser(
    @Req() req: any,
    @Res() res: any,
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete('/:userId')
  async deleteUser(
    @Req() req: any,
    @Res() res: any,
    @Param('userId') userId: string,
  ) {
    return res
      .status(HttpStatus.OK)
      .json(await this.userService.deleteUser(userId));
  }
}
