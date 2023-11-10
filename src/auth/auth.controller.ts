import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role, Users } from '@prisma/client';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create.users.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Res() res: any, @Body() body: LoginDto) {
    if (!body.email || !body.password) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Error: Check request parameters' });
    }

    const findUser: Users = await this.usersService.findUserByEmail(body.email);

    if (!findUser) {
      const newUser: CreateUserDto = {
        firstName: '',
        lastName: '',
        email: body.email,
        password: body.password,
        roles: Role.Manager,
      };
      const createdUser = await this.usersService.registerUserByAdmin(newUser);

      const accessToken = this.authService.generateAccessToken(
        createdUser.id.toString(),
      );
      const refreshToken = this.authService.generateRefreshToken(
        createdUser.id.toString(),
      );

      return res.status(HttpStatus.OK).json({ accessToken, refreshToken });
    }

    if (await this.authService.compareHash(body.password, findUser.password)) {
      const accessToken = this.authService.generateAccessToken(
        findUser.id.toString(),
      );
      const refreshToken = this.authService.generateRefreshToken(
        findUser.id.toString(),
      );

      return res.status(HttpStatus.OK).json({ accessToken, refreshToken });
    }

    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Некоректні дані користувача' });
  }

  @Post('refresh-token')
  async refreshToken(@Res() res: any, @Body() body: { refreshToken: string }) {
    try {
      const { refreshToken } = body;

      if (this.authService.isRefreshTokenUsed(refreshToken)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Refresh token has already been used' });
      }

      const decodedToken = this.authService.verifyToken(
        refreshToken,
        'refreshToken',
      );

      const userId = decodedToken.id;

      const newRefreshToken = this.authService.generateRefreshToken(userId);
      this.authService.markRefreshTokenAsUsed(refreshToken);

      return res.status(HttpStatus.OK).json({ refreshToken: newRefreshToken });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid refreshToken' });
    }
  }

  @Patch('activate/:userId')
  async activateUser(
    @Param('userId') userId: string,
    @Body()
    activateUserDto: { email: string; password: string; accessToken: string },
    @Res() res: any,
  ) {
    try {
      const { email, password, accessToken } = activateUserDto;

      if (!email || !password || !accessToken || password.length < 5) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Некоректні дані користувача' });
      }

      const updatedUser = await this.usersService.activateUser(
        Number(userId),
        email,
        password,
      );
      const userWithoutPassword = { ...updatedUser, password: undefined };
      return res.status(HttpStatus.OK).json(userWithoutPassword);
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Некоректні дані користувача' });
    }
  }
}
