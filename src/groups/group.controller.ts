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

// Додаємо теги для Swagger
@ApiTags('Groups')
@Controller('groups')
@UseGuards(AuthGuard()) // Використовуємо сторожа аутентифікації
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly validationsService: ValidationsService,
  ) {}

  // Обробник для створення групи
  @Post(':group')
  @UseGuards(AuthGuard()) // Використовуємо сторожа аутентифікації
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER]) // Встановлюємо метадані для ролей
  @ApiOperation({ summary: 'Create group' }) // Додаємо опис операції для Swagger
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    try {
      await this.groupService.createGroup(createGroupDto); // Викликаємо сервіс для створення групи
      return {
        message: 'Групу успішно створено',
      };
    } catch (error) {
      // Обробляємо помилку
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

  // Обробник для отримання всіх груп
  @Get()
  @UseGuards(AuthGuard())
  @SetMetadata('roles', [Role.ADMIN, Role.MANAGER])
  @ApiOperation({ summary: 'Get all groups' })
  getAllGroups() {
    return this.groupService.getAllGroups();
  }
}
