import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '@gmail.com' })
  @IsString()
  @IsNotEmpty({ message: 'В тебе 100% є поштоваа скринька! Пошукай!' })
  @IsEmail()
  email: string;
}
