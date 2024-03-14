import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../core/orm/prisma.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { Group } from '@prisma/client';
import { ValidationsService } from '../core/validations/validations.service';

@Injectable()
export class GroupService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly validationsService: ValidationsService,
  ) {}

  // Створює нову групу з вказаною назвою.
  async createGroup(createGroupDto: CreateGroupDto) {
    const filteredTitle = this.validationsService.checkForBadWords(
      createGroupDto.title, // Фільтруємо назву групи для перевірки на образливі слова.
    );

    if (filteredTitle !== createGroupDto.title) {
      throw new BadRequestException(
        'Заборонено використовувати матюкливі слова у назві групи.',
      ); // Якщо фільтрована назва відрізняється від введеної, викидаємо виняток.
    }

    // Перевірка на додаткові поля у вхідних даних.
    this.validationsService.validateExtraField(createGroupDto, ['title']);
    const { title } = createGroupDto;

    // Створення нової групи у базі даних.
    return this.prismaService.group.create({
      data: {
        title,
      },
    });
  }

  // Отримує групу за її назвою.
  async getGroupById(title: string): Promise<Group | null> {
    return this.prismaService.group.findFirst({
      where: {
        title: {
          equals: title,
        },
      },
    });
  }

  // Отримує всі групи.
  async getAllGroups() {
    return this.prismaService.group.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
