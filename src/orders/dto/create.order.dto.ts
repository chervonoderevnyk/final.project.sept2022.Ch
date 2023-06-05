import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

// @Entity({ name: 'orders' })
export class CreateOrderDto {
  @ApiProperty()
  @IsNumber()
  // @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @Column('text')
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  // @Column('text')
  surname: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
  // @Column({ unique: true })
  email: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // @Column('int')
  phone: string | null;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  // @Column('int')
  age: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @Column('text')
  course: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @Column('text')
  course_format: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  // @Column('text')
  course_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // @Column('text')
  status: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  // @Column('int')
  sum: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  // @Column('int')
  alreadyPaid: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  // @Column('text')
  group: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // @Column('text')
  utm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // @Column('text')
  msg: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  // @Column('text')
  manager: string;
}
