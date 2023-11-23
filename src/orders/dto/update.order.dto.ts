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
      'Name must contain only letters of English and Ukrainian alphabets',
  })
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Name must contain only letters of English and Ukrainian alphabets',
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
  @Matches(/^\+?\d+$/, { message: 'Invalid phone number format' })
  @Matches(/^.{10,16}$/, { message: 'Phone number length is incorrect' })
  readonly phone?: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(15, { message: 'Age must not be negative' })
  @Max(110, { message: 'Age must not be greater than 110' })
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
  @Min(0, { message: 'Sum must be a positive number or zero' })
  @Max(1000000, { message: 'Sum must not exceed 1000000' })
  readonly sum?: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Sum must be a positive number or zero' })
  @Max(1000000, { message: 'Sum must not exceed 1000000' })
  readonly alreadyPaid?: number | null;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  group?: Group | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsDateString({ message: 'Invalid date format for created_at' } as any)
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
