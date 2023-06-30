import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly surname?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly email?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly phone?: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  readonly age?: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly course?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly course_format?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly course_type?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly status?: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  readonly sum?: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  readonly alreadyPaid?: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly group?: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly created_at?: Date | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly utm?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  readonly msg?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  manager?: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  readonly managerInfo?: { lastName: string; id: number };
}
