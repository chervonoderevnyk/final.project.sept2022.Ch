import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';
import { ValidationsService } from '../core/validations/validations.service';
import { RoleGuard } from './guard/roles.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private validationsService: ValidationsService,
  ) {}

  // Обробляє запит на вхід користувача
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async loginUser(@Res() res: any, @Body() body: LoginDto) {
    const expectedFields = ['email', 'password']; // Очікувані поля для авторизації

    const invalidFields = Object.keys(body).filter(
      (key) => !expectedFields.includes(key),
    ); // Знаходить невалідні поля у запиті

    if (invalidFields.length > 0) {
      return res.status(HttpStatus.FORBIDDEN).json({
        message: `Знайдено непередбачені поля у запиті: ${invalidFields.join(
          ', ',
        )}`,
      }); // Перевіряє наявність невалідних полів
    }

    if (!body.email || !body.password) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'Некоректні дані користувача' });
    } // Перевіряє коректність даних користувача

    this.validationsService.validatePasswordLength(body.password); // Перевіряє довжину паролю

    const findUser: Users = await this.usersService.findUserByEmail(body.email); // Знаходить користувача за email

    if (!findUser || !findUser.active) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Некоректні дані користувача',
      });
    } // Перевіряє наявність користувача та його активацію

    // Порівнює хеш паролю
    if (await this.authService.compareHash(body.password, findUser.password)) {
      // Генерує та повертає токени доступу
      const accessToken = this.authService.generateAccessToken(
        findUser.id.toString(),
      );
      const refreshToken = this.authService.generateRefreshToken(
        findUser.id.toString(),
      );

      return res.status(HttpStatus.OK).json({ accessToken, refreshToken });
    }

    return res // Повертає невдалу аутентифікацію
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: 'Некоректні дані користувача' });
  }

  // Оновлює токен доступу
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Res() res: any, @Body() body: { refreshToken: string }) {
    try {
      const { refreshToken } = body;

      if (this.authService.isRefreshTokenUsed(refreshToken)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Токен оновлення вже використано' });
      } // Перевіряє, чи використано токен оновлення

      const decodedToken = this.authService.verifyToken(
        refreshToken,
        'refreshToken',
      ); // Розкодовує та перевіряє токен оновлення

      const userId = decodedToken.id;

      // Генерує нові токени доступу та оновлення
      const newAccessToken = this.authService.generateAccessToken(userId);
      const newRefreshToken = this.authService.generateRefreshToken(userId);

      this.authService.markRefreshTokenAsUsed(refreshToken); // Позначає токен оновлення як використаний

      return res // Повертає нові токени
        .status(HttpStatus.OK)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      return res // Повертає невдалу авторизацію
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Недійсний токен оновлення' });
    }
  }

  // Активує користувача
  @Patch('activate')
  @ApiOperation({ summary: 'Activate user' })
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
          .json({ message: 'Некоректні дані користувача' });
      } // Перевіряє коректність даних користувача

      const isValidToken = this.authService.verifyToken(
        accessToken,
        'accessTokenActivate',
      ); // Перевіряє та розкодовує токен активації

      if (!isValidToken) {
        throw new UnauthorizedException('Некоректний токен активації');
      }

      const userId = isValidToken.id;

      const userToActivate = await this.usersService.getUserById(userId); // Знаходить користувача за ID

      if (!userToActivate || userToActivate.id.toString() !== userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Некоректні дані користувача',
        });
      } // Перевіряє коректність користувача для активації

      if (userToActivate.active) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Користувач вже активований',
        });
      } // Перевіряє, чи користувач неактивний

      this.validationsService.validatePasswordLength(password); // Валідує довжину паролю та активує користувача

      const updatedUser = await this.usersService.activateUser(
        Number(userId),
        password,
      );

      const userWithoutPassword = { ...updatedUser, password: undefined }; // Видаляє пароль користувача з відповіді
      return res.status(HttpStatus.OK).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: error.message });
      }

      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Некоректні дані користувача' });
    }
  }

  // Ререгенерує токен активації
  @Patch('regenerate-activate-token/:id')
  @UseGuards(AuthGuard(), RoleGuard)
  @SetMetadata('roles', ['Admin'])
  @ApiOperation({ summary: 'Regenerate activation token' })
  async regenerateActivateToken(@Param('id') id: string, @Res() res: any) {
    try {
      const existingUser = await this.usersService.getUserById(id); // Знаходить користувача за ID

      if (!existingUser) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Користувач з вказаним ID не знайдений',
        });
      } // Перевіряє наявність користувача

      if (existingUser.active) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Користувач вже активований',
        });
      } // Перевіряє, чи користувач неактивований

      const newActivateToken = this.authService.generateAccessTokenActivate(
        existingUser.id.toString(),
      ); // Генерує новий токен активації

      return res // Повертає новий токен активації
        .status(HttpStatus.OK)
        .json({ activateToken: newActivateToken });
    } catch (error) {
      return res // Повертає помилку, якщо сталася непередбачувана помилка
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Непередбачена помилка' });
    }
  }
}
