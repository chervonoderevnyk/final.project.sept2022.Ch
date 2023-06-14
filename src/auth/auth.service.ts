import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async compareHash(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string): string {
    const payload = { id: userId };
    return this.jwtService.sign(payload, { expiresIn: '10m' });
  }

  generateRefreshToken(userId: string): string {
    const payload = { id: userId };
    return this.jwtService.sign(payload, { expiresIn: '20m' });
  }
}
