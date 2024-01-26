import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserByAdminDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Пригадай як його звати' })
  lastName: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty({ message: 'Пригадай його прізвище' })
  firstName: string;

  @ApiProperty({ required: false, example: '@gmail.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'В цього юзера 100% є поштоваа скринька! Пошукай!' })
  email: string;
}
