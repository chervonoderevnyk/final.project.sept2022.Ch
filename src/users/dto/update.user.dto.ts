import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  readonly lastName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly password: string;

  @ApiProperty({ required: true, example: '@gmail.com' })
  @IsString()
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @ApiProperty({ enum: Role })
  @IsString()
  @IsOptional()
  readonly roles: Role;
}
