import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private usedRefreshTokens: Set<string> = new Set();

  constructor(private jwtService: JwtService) {}

  async compareHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string): string {
    const payload = { id: userId, sub: 'accessToken' };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '10m',
      keyid: 'accessKey',
    });
    return accessToken;
  }

  generateRefreshToken(userId: string): string {
    const payload = { id: userId, sub: 'refreshToken' };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '20m',
      keyid: 'refreshKey',
    });
    return refreshToken;
  }

  markRefreshTokenAsUsed(refreshToken: string): void {
    this.usedRefreshTokens.add(refreshToken);
  }

  isRefreshTokenUsed(refreshToken: string): boolean {
    return this.usedRefreshTokens.has(refreshToken);
  }

  generateAccessTokenActivate(userId: string): string {
    const payload = { id: userId, sub: 'accessTokenActivate' };
    const accessTokenActivate = this.jwtService.sign(payload, {
      expiresIn: '10m',
      keyid: 'activateKey',
    });
    return accessTokenActivate;
  }

  verifyToken(token: string, expectedSub: string): any {
    try {
      const decoded = this.jwtService.verify(token);

      if (decoded.sub !== expectedSub) {
        throw new UnauthorizedException('Invalid token type');
      }

      if (decoded.keyid === 'accessKey' && expectedSub !== 'accessToken') {
        throw new UnauthorizedException('Invalid token type');
      }

      if (decoded.keyid === 'refreshKey' && expectedSub !== 'refreshToken') {
        throw new UnauthorizedException('Invalid token type');
      }

      if (
        decoded.keyid === 'activateKey' &&
        expectedSub !== 'accessTokenActivate'
      ) {
        throw new UnauthorizedException('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
