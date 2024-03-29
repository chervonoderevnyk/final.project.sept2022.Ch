import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { BearerStrategy } from './bearer.strategy';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../core/orm/prisma.service';
import { RoleGuard } from './guard/roles.guard';
import { AuthController } from './auth.controller';
import { ValidationsService } from '../core/validations/validations.service';
import { MailModule } from '../core/mail/mail.module';
import { MailService } from '../core/mail/mail.service';

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
    MailModule,
  ],
  providers: [
    AuthService,
    BearerStrategy,
    UsersService,
    PrismaService,
    RoleGuard,
    ValidationsService,
    MailService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
