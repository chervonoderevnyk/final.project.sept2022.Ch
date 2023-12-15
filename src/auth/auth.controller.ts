import {
  Body,
  Controller,
  HttpStatus, Param,
  Patch,
  Post,
  Res,
  SetMetadata,
  UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { ValidationsService } from '../core/validations/validations.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from './guard/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private validationsService: ValidationsService,
  ) {}

  @Post('login')
  async loginUser(@Res() res: any, @Body() body: LoginDto) {
    if (!body.email || !body.password) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Некоректні дані користувача' });
    }

    this.validationsService.validatePasswordLength(body.password);

    const findUser: Users = await this.usersService.findUserByEmail(body.email);

    if (!findUser || !findUser.active) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Некоректні дані користувача',
      });
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

      const newAccessToken = this.authService.generateAccessToken(userId);
      const newRefreshToken = this.authService.generateRefreshToken(userId);

      this.authService.markRefreshTokenAsUsed(refreshToken);

      return res
        .status(HttpStatus.OK)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid refreshToken' });
    }
  }

  @Patch('activate')
  async activateUser(
    @Body()
    activateUserDto: { password: string; accessToken: string },
    @Res() res: any,
  ) {
    try {
      const { password, accessToken } = activateUserDto;

      if (!password || !accessToken) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Некоректні дані користувача1' });
      }

      const isValidToken = this.authService.verifyToken(
        accessToken,
        'accessTokenActivate',
      );

      if (!isValidToken) {
        throw new UnauthorizedException('Некоректний токен активації');
      }

      const userId = isValidToken.id;

      const userToActivate = await this.usersService.getUserById(userId);

      if (!userToActivate || userToActivate.id.toString() !== userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Некоректні дані користувача2',
        });
      }

      const updatedUser = await this.usersService.activateUser(
        Number(userId),
        password,
      );

      const userWithoutPassword = { ...updatedUser, password: undefined };
      return res.status(HttpStatus.OK).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: error.message });
      }

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Некоректні дані користувача3' });
    }
  }

  @Patch('regenerate-activate-token/:id')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  async regenerateActivateToken(
    @Param('id') id: string,
    @Res() res: any,
  ) {
    try {
      const existingUser = await this.usersService.getUserById(id);

      if (!existingUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Користувач з вказаним ID не знайдений',
        });
      }

      if (existingUser.active) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Користувач вже активований',
        });
      }

      const newActivateToken = this.authService.generateAccessTokenActivate(
        existingUser.id.toString(),
      );

      return res
        .status(HttpStatus.OK)
        .json({ activateToken: newActivateToken });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Непередбачена помилка' });
    }
  }
}
