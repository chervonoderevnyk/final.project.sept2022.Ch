import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  // Набори для зберігання використаних токенів оновлення та зміни паролю
  private usedRefreshTokens: Set<string> = new Set();
  private usedChangePasswordTokens: Set<string> = new Set();

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Порівняння пароля з хешем
  async compareHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  // Генерація accessToken
  generateAccessToken(userId: string): string {
    const payload = { id: userId, sub: 'accessToken' };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '10m',
      keyid: 'accessKey',
    });
    return accessToken;
  }

  // Генерація refreshToken
  generateRefreshToken(userId: string): string {
    const payload = { id: userId, sub: 'refreshToken' };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '20m',
      keyid: 'refreshKey',
    });
    return refreshToken;
  }

  // Відзначення refreshToken як використаного
  markRefreshTokenAsUsed(refreshToken: string): void {
    this.usedRefreshTokens.add(refreshToken);
  }

  // Перевірка, чи використано refreshToken
  isRefreshTokenUsed(refreshToken: string): boolean {
    return this.usedRefreshTokens.has(refreshToken);
  }

  // Генерація accessToken для активації облікового запису
  generateAccessTokenActivate(userId: string): string {
    const payload = { id: userId, sub: 'accessTokenActivate' };
    const accessTokenActivate = this.jwtService.sign(payload, {
      expiresIn: '10m',
      keyid: 'activateKey',
    });
    return accessTokenActivate;
  }

  // Перевірка та розшифрування токену
  verifyToken(token: string, expectedSub: string): any {
    try {
      const decoded = this.jwtService.verify(token);

      // Перевірка правильності типу токену
      if (decoded.sub !== expectedSub) {
        throw new UnauthorizedException('Неправильний тип токену');
      }

      if (decoded.keyid === 'accessKey' && expectedSub !== 'accessToken') {
        throw new UnauthorizedException('Неправильний тип токену');
      }

      if (decoded.keyid === 'refreshKey' && expectedSub !== 'refreshToken') {
        throw new UnauthorizedException('Неправильний тип токену');
      }

      if (
        decoded.keyid === 'activateKey' &&
        expectedSub !== 'accessTokenActivate'
      ) {
        throw new UnauthorizedException('Неправильний тип токену');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Недійсний токен');
    }
  }

  // Генерація токену для зміни паролю
  generateChangePasswordToken(userId: string): string {
    const payload = { id: userId, sub: 'changePasswordToken' };
    const changePasswordToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });
    return changePasswordToken;
  }

  // Перевірка та розшифрування токену для зміни паролю
  async verifyChangePasswordToken(token: string): Promise<Users> {
    try {
      const { id } = this.jwtService.verify(token, { ignoreExpiration: false });

      const user = await this.usersService.getUserById(id.toString());

      if (!user) {
        throw new UnauthorizedException('Користувача не знайдено');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Невірний токен');
    }
  }

  // Відзначення changePasswordToken як використаного
  markChangePasswordTokenAsUsed(changePasswordToken: string): void {
    this.usedChangePasswordTokens.add(changePasswordToken);
  }

  // Перевірка, чи використано changePasswordToken
  isChangePasswordTokenUsed(changePasswordToken: string): boolean {
    return this.usedChangePasswordTokens.has(changePasswordToken);
  }
}
