import { forwardRef, Module } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { OrdersService } from '../orders/orders.service';
import { OrdersModule } from '../orders/orders.module';
import { ValidationsService } from '../core/validations/validations.service';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [PrismaService, UsersService, OrdersService, ValidationsService],
  controllers: [UsersController],
})
export class UsersModule {}
