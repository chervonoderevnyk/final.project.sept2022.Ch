import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, example: '@gmail.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ enum: Role })
  @IsString()
  @IsOptional()
  roles: Role;
}
