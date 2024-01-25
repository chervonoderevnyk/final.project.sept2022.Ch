import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Course,
  CourseFormat,
  CourseType,
  Group,
  Status,
} from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Назва повинна містити лише літери англійської та української абеток',
  })
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Назва повинна містити лише літери англійської та української абеток',
  })
  readonly surname?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
  readonly email?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^\+?\d+$/, { message: 'Неправильний формат телефонного номера' })
  @Matches(/^.{10,16}$/, {
    message: 'Неправильно вказано довжину номера телефону',
  })
  readonly phone?: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsInt({ message: 'Вік повинен бути цілим числом' })
  @Min(15, { message: 'Вік не повинен бути негативним' })
  @Max(110, { message: 'Вік не повинен перевищувати 110 років' })
  readonly age?: number | null;

  @ApiProperty({ required: false, enum: Course })
  @IsString()
  @IsOptional()
  course?: Course;

  @ApiProperty({ required: false, enum: CourseFormat })
  @IsString()
  @IsOptional()
  course_format?: CourseFormat;

  @ApiProperty({ required: false, enum: CourseType })
  @IsString()
  @IsOptional()
  course_type?: CourseType;

  @ApiProperty({ required: false, enum: Status })
  @IsString()
  @IsOptional()
  status?: Status | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Сума повинна бути додатнім числом або нулем' })
  @Max(1000000, { message: 'Сума не повинна перевищувати 1000000' })
  readonly sum?: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Сума повинна бути додатнім числом або нулем' })
  @Max(1000000, { message: 'Сума не повинна перевищувати 1000000' })
  readonly alreadyPaid?: number | null;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  group?: Group | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsDateString({ message: 'Невірний формат дати для created_at' } as any)
  readonly created_at?: Date | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly utm?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly msg?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  manager?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  managerInfo?: { lastName: string; id: number };
}
