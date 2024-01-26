import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Твій коментар гідний бути написаним!' })
  readonly commentText: string;
}
