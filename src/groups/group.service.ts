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

  async createGroup(createGroupDto: CreateGroupDto) {
    const filteredTitle = this.validationsService.checkForBadWords(
      createGroupDto.title,
    );

    if (filteredTitle !== createGroupDto.title) {
      throw new BadRequestException(
        'Заборонено використовувати матюкливі слова у назві групи.',
      );
    }

    this.validationsService.validateExtraField(createGroupDto, ['title']);
    const { title } = createGroupDto;

    return this.prismaService.group.create({
      data: {
        title,
      },
    });
  }

  async getGroupById(title: string): Promise<Group | null> {
    return this.prismaService.group.findFirst({
      where: {
        title: {
          equals: title,
        },
      },
    });
  }

  async getAllGroups() {
    return this.prismaService.group.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }
}
