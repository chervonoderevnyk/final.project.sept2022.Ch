import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  surname: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  age: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course_format: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  course_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sum: number | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  alreadyPaid: number | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  created_at: Date | null;

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
//id
