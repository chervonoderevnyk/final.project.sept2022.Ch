import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersService } from './orders/orders.service';
import { OrdersController } from './orders/orders.controller';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './core/orm/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PassportWrapperModule } from './auth/passport-wrapper.module';
import { AuthController } from './auth/auth.controller';
import { CreateOrderDto } from './orders/dto/create.order.dto';

@Module({
  imports: [
    OrdersModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PassportWrapperModule,
    // TypeOrmModule.forFeature([CreateOrderDto]),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   url: process.env.DATABASE_URL,
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
  ],
  controllers: [
    AppController,
    OrdersController,
    UsersController,
    AuthController,
  ],
  providers: [AppService, OrdersService, PrismaModule, UsersService],
})
export class AppModule {}
