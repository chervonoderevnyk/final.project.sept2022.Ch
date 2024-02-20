import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '@gmail.com' })
  @IsString()
  @IsNotEmpty({ message: 'В тебе 100% є поштоваа скринька! Пошукай!' })  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
