import { Module } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../core/orm/prisma.module';
import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [PrismaService, OrdersService, UsersService],
  exports: [OrdersService],
})
export class OrdersModule {}
