import {
  Controller,
  Get,
  Post,
  Body,
  Inject,
  forwardRef,
  HttpException,
  HttpStatus,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { GroupService } from './group.service';
import { UsersService } from '../users/users.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { Role } from '../auth/guard/roles.enum';
import { ValidationsService } from '../core/validations/validations.service';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(AuthGuard())
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly validationsService: ValidationsService,
  ) {}

  @Post(':group')
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiOperation({ summary: 'Create group' })
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    try {
      await this.groupService.createGroup(createGroupDto);
      return {
        message: 'Групу успішно створено',
      };
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
