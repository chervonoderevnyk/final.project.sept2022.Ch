import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { BearerStrategy } from './bearer.strategy';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from './auth.module';

@Global() // Позначення модуля як глобального
@Module({
  imports: [
    UsersModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'bearer' }), // Реєстрація PassportModule зі стратегією "bearer"
    JwtModule.registerAsync({
      // Асинхронна реєстрація JwtModule
      useFactory: async () => ({
        secret: 'Secret', // Секретний ключ для підпису токенів
        signOptions: {
          expiresIn: '24h', // Термін дії токенів - 24 години
        },
      }),
    }),
  ],
  providers: [BearerStrategy, UsersService],
  exports: [PassportModule],
})
export class PassportWrapperModule {}
