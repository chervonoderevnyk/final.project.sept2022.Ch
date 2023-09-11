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
  ConflictException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Group } from '@prisma/client';

import { GroupService } from './group.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { UpdateOrderDto } from '../orders/dto/update.order.dto';
import { CreateGroupDto } from './dto/create.group.dto';
import { PrismaService } from '../core/orm/prisma.service';

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
  ) {}

  @Post(':orderId/group')
  async createGroup(
    @Param('orderId') orderId: string,
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: any,
  ) {
    try {
      const existingGroup = await this.prismaService.group.findFirst({
        where: {
          title: createGroupDto.title,
        },
      });

      if (existingGroup) {
        throw new ConflictException('Група з такою назвою вже існує');
      }

      const updateOrderDto = new UpdateOrderDto();

      const order = await this.ordersService.getOrderById(orderId);
      const user = await this.userService.getUserById(req.user.id);

      if (!updateOrderDto.manager && user.lastName) {
        updateOrderDto.manager = user.lastName || updateOrderDto.manager;
      }

      updateOrderDto.managerInfo = { lastName: user.lastName, id: user.id };
      updateOrderDto.group = {
        ...createGroupDto,
        id: 0,
        orderId: 0,
        userId: 0,
      };

      const updatedOrder = await this.ordersService.updateOrder(
        orderId,
        updateOrderDto,
        user,
      );

      const updatedGroupDto: Group = {
        ...createGroupDto,
        id: 0,
        orderId: Number(orderId),
        userId: req.user.id,
        title: updatedOrder.group,
      };

      await this.ordersService.updateOrder(
        orderId,
        { group: updatedGroupDto },
        user,
      );

      return this.groupService.createGroup(
        orderId,
        updatedGroupDto,
        req.user.id,
      );
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
  getAllGroups() {
    return this.groupService.getAllGroups();
  }
}

// @Patch(':id')
// updateGroup(
//   @Param('id') groupId: number,
//   @Body() groupData: { title: string },
// ) {
//   return this.groupService.updateGroup(groupId, groupData.title);
// }
