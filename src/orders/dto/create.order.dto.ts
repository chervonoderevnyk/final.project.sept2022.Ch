import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  surname: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
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
  sum: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  alreadyPaid: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
