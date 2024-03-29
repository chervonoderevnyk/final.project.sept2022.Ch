import { Module } from '@nestjs/common';

import { OrdersService } from '../orders/orders.service';
import { PrismaService } from '../core/orm/prisma.service';
import { PrismaModule } from '../core/orm/prisma.module';
import { CommentController } from './comment.controller';
import { UsersService } from '../users/users.service';
import { CommentService } from './comment.service';
import { ValidationsService } from '../core/validations/validations.service';
import { AuthModule } from '../auth/auth.module';
import { GroupService } from '../groups/group.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CommentController],
  providers: [
    OrdersService,
    PrismaService,
    CommentService,
    UsersService,
    ValidationsService,
    GroupService,
  ],
  exports: [CommentService],
})
export class CommentModule {}
