import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsOptional()
  lastName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Придумай надійний пароль!' })
  password: string;

  @ApiProperty({ required: true, example: '@gmail.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'В цього юзера 100% є поштоваа скринька! Пошукай!' })
  email: string;

  @ApiProperty({ enum: Role })
  @IsString()
  @IsOptional()
  roles: Role;
}
