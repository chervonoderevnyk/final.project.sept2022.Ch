import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { BearerStrategy } from './bearer.strategy';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from './auth.module';

@Global()
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
  ],
  providers: [BearerStrategy, UsersService],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
