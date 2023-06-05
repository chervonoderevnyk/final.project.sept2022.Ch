import { forwardRef, Module } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateOrderDto } from '../orders/dto/create.order.dto';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    // TypeOrmModule.forFeature([CreateOrderDto]),
  ],
  providers: [PrismaService, UsersService, OrdersService],
  controllers: [UsersController],
})
export class UsersModule {}
