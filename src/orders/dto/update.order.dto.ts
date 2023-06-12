import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly surname: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly email: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly phone: string | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly age: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly course: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly course_format: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly course_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly status: string | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly sum: number | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  readonly alreadyPaid: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly group: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly created_at: Date | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly utm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly msg: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly manager: string;
}
//id
