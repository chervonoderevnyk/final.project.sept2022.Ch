import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Course, CourseFormat, CourseType, Group } from '@prisma/client';

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly surname?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly email?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly phone?: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  readonly age?: number | null;

  @ApiProperty({ required: false, enum: Course })
  @IsString()
  @IsOptional()
  readonly course?: Course;

  @ApiProperty({ required: false, enum: CourseFormat })
  @IsString()
  @IsOptional()
  readonly course_format?: CourseFormat;

  @ApiProperty({ required: false, enum: CourseType })
  @IsString()
  @IsOptional()
  readonly course_type?: CourseType;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly status?: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  readonly sum?: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  readonly alreadyPaid?: number | null;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  group?: Group | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
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
