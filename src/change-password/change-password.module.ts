import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ChangePasswordService } from './change-password.service';
import { ChangePasswordController } from './change-password.controller';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { BearerStrategy } from '../auth/bearer.strategy';
import { PrismaService } from '../core/orm/prisma.service';
import { RoleGuard } from '../auth/guard/roles.guard';
import { ValidationsService } from '../core/validations/validations.service';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../core/mail/mail.module';
import { MailService } from '../core/mail/mail.service';

@Module({
  imports: [
    UsersModule,
    AuthModule,
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
    JwtService,
    ChangePasswordService,
    MailService,
  ],
  exports: [ChangePasswordService],
  controllers: [ChangePasswordController],
})
export class ChangePasswordModule {}
