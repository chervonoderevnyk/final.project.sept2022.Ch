import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Name must contain only letters of English and Ukrainian alphabets',
  })
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Name must contain only letters of English and Ukrainian alphabets',
  })
  surname: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^\+?\d+$/, { message: 'Invalid phone number format' })
  @Matches(/^.{10,16}$/, { message: 'Phone number length is incorrect' })
  phone: string | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsInt({ message: 'Age must be an integer' })
  @Min(15, { message: 'Age must not be negative' })
  @Max(110, { message: 'Age must not be greater than 110' })
  age: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_format: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Sum must be a positive number or zero' })
  @Max(1000000, { message: 'Sum must not exceed 1000000' })
  sum: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Sum must be a positive number or zero' })
  @Max(1000000, { message: 'Sum must not exceed 1000000' })
  alreadyPaid: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsDateString({ message: 'Invalid date format for created_at' } as any)
  created_at: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  utm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  msg: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manager: string;
}
