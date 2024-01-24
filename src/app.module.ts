import { Module, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { OrdersService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './core/orm/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PassportWrapperModule } from './auth/passport-wrapper.module';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from './core/orm/prisma.service';
import { CommentService } from './comments/comment.service';
import { CommentModule } from './comments/comment.module';
import { CommentController } from './comments/comment.controller';
import { OrdersController } from './orders/orders.controller';
import { GroupModule } from './groups/group.module';
import { GroupController } from './groups/group.controller';
import { GroupService } from './groups/group.service';
import { ValidationsService } from './core/validations/validations.service';
import { ValidationsModule } from './core/validations/validations.module';
import { ChangePasswordModule } from './change-password/change-password.module';
import { ChangePasswordController } from './change-password/change-password.controller';
import { ChangePasswordService } from './change-password/change-password.service';
import { MailModule } from './core/mail/mail.module';
import { MailService } from './core/mail/mail.service';

@Module({
  imports: [
    OrdersModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    PassportWrapperModule,
    CommentModule,
    GroupModule,
    ValidationsModule,
    ChangePasswordModule,
    MailModule,
  ],
  controllers: [
    OrdersController,
    UsersController,
    AuthController,
    CommentController,
    GroupController,
    ChangePasswordController,
  ],
  providers: [
    OrdersService,
    PrismaModule,
    UsersService,
    PrismaService,
    CommentService,
    GroupService,
    ValidationsService,
    ChangePasswordService,
    JwtService,
    MailService,
  ],
  exports: [JwtService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      console.log('Підключення до бази даних встановлено!');
    } catch (error) {
      console.error('Помилка підключення до бази даних:', error);
    }
  }
}
