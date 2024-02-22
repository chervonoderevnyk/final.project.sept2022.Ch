import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Strategy } from 'passport-http-bearer';
import { UsersService } from '../users/users.service';
import { Users } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(
    private readonly jwtService: JwtService, // Ін'єкція сервісу для роботи з JWT токенами.
    private readonly userService: UsersService, // Ін'єкція сервісу для роботи з користувачами.
    private readonly authService: AuthService, // Ін'єкція сервісу для автентифікації.
  ) {
    super(); // Викликаємо конструктор базового класу
  }

  async validate(token: string): Promise<Users> {
    let user: Users; // Змінна для зберігання інформації про користувача
    try {
      const decodedToken = this.authService.verifyToken(token, 'accessToken'); // Розкодування токену та перевірка його валідності
      user = await this.userService.getUserById(decodedToken.id); // Отримуємо інформацію про користувача за ідентифікатором
      if (!user) {
        throw new UnauthorizedException(); // Якщо користувач не знайдений,  викидаємо помилку неавторизованого доступу
      }
    } catch (err) {
      throw new UnauthorizedException(); // В разі будь-якої помилки в автентифікації, викидаємо помилку неавторизованого доступу
    }
    return user; // Повертаємо інформацію про користувача
  }
}
