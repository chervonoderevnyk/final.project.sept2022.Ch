import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { BearerStrategy } from './bearer.strategy';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../core/orm/prisma.service';
import { RoleGuard } from './guard/roles.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'bearer' }),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: 'Secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    BearerStrategy,
    UsersService,
    PrismaService,
    RoleGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
