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
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(token: string): Promise<Users> {
    let user: Users;
    try {
      const decodedToken = this.authService.verifyToken(token, 'accessToken');
      user = await this.userService.getUserById(decodedToken.id);
      if (!user) {
        throw new UnauthorizedException();
      }
    } catch (err) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
