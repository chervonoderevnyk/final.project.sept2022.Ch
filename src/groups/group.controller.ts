import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  forwardRef,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Group } from '@prisma/client';

import { GroupService } from './group.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { PrismaService } from '../core/orm/prisma.service';
import { UpdateOrderDto } from '../orders/dto/update.order.dto';
import { ValidationsService } from '../core/validations/validations.service';
import { Role } from '../auth/guard/roles.enum';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(AuthGuard())
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly ordersService: OrdersService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly prismaService: PrismaService,
    private readonly validationsService: ValidationsService,
  ) {}

  @Post(':orderId/group')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  async createGroup(
    @Param('orderId') orderId: string,
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: any,
  ) {
    try {
      const updateOrderDto = new UpdateOrderDto();

      const order = await this.ordersService.getOrderById(orderId);
      const user = await this.userService.getUserById(req.user.id);

      this.validationsService.validateLastName(updateOrderDto, order, user);

      if (!updateOrderDto.manager && user.lastName) {
        updateOrderDto.manager = user.lastName || updateOrderDto.manager;
      }

      updateOrderDto.managerInfo = { lastName: user.lastName, id: user.id };

      const existingGroup = await this.prismaService.group.findFirst({
        where: {
          title: createGroupDto.title,
        },
      });

      if (existingGroup) {
        updateOrderDto.group = existingGroup;
      } else {
        updateOrderDto.group = {
          ...createGroupDto,
          id: 0,
        } as Group;
      }

      const updatedOrder = await this.ordersService.updateOrder(
        orderId,
        updateOrderDto,
        user,
      );

      const updatedGroupDto: Group = {
        ...createGroupDto,
        id: 0,
      };

      await this.ordersService.updateOrder(
        orderId,
        { group: updatedGroupDto },
        user,
      );

      if (!existingGroup) {
        await this.groupService.createGroup(updatedGroupDto);
      }

      return updatedGroupDto;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  getAllGroups() {
    return this.groupService.getAllGroups();
  }
}
