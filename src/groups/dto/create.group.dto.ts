import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'Напружся і дай назву цій групі!' })
  readonly title: string;
}
