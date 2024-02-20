import { Module } from '@nestjs/common';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../core/orm/prisma.module';
import { PrismaService } from '../core/orm/prisma.service';
import { UsersService } from '../users/users.service';
import { ValidationsModule } from '../core/validations/validations.module';
import { AuthModule } from '../auth/auth.module';
import { GroupModule } from '../groups/group.module';
import { GroupService } from '../groups/group.service';

@Module({
  imports: [PrismaModule, ValidationsModule, AuthModule, GroupModule],
  controllers: [OrdersController],
  providers: [PrismaService, OrdersService, UsersService, GroupService],
  exports: [OrdersService],
})
export class OrdersModule {}
