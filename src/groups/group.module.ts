import { Module } from '@nestjs/common';

import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { PrismaService } from '../core/orm/prisma.service';
import { PrismaModule } from '../core/orm/prisma.module';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { ValidationsService } from '../core/validations/validations.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [GroupController],
  providers: [
    GroupService,
    PrismaService,
    OrdersService,
    UsersService,
    ValidationsService,
  ],
  exports: [GroupService],
})
export class GroupModule {}
