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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { GroupService } from './group.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create.group.dto';
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
  ) {}

  @Post(':orderId/group')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiOperation({ summary: 'Create group for an order' })
  async createGroup(
    @Param('orderId') orderId: string,
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: any,
  ) {
    try {
      const user = await this.userService.getUserById(req.user.id);

      const updatedGroupDto = await this.groupService.createOrUpdateGroup(
        orderId,
        createGroupDto,
        user,
      );

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
  @ApiOperation({ summary: 'Get all groups' })
  getAllGroups() {
    return this.groupService.getAllGroups();
  }
}
