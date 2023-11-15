import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '@gmail.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(5, 25, { message: 'Некоректні дані користувача' })
  @IsNotEmpty()
  password: string;
}
