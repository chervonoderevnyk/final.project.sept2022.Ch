import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Назва повинна містити лише літери англійської та української абетки',
  })
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ]+$/, {
    message:
      'Назва повинна містити лише літери англійської та української абеток',
  })
  surname: string | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^\+?\d+$/, { message: 'Неправильний формат телефонного номера' })
  @Matches(/^.{10,16}$/, {
    message: 'Неправильно вказано довжину номера телефону',
  })
  phone: string | null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @IsInt({ message: 'Вік повинен бути цілим числом' })
  @Min(15, { message: 'Вік не повинен бути негативним' })
  @Max(110, { message: 'Вік не повинен перевищувати 110 років' })
  age: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_format: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  course_type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Сума повинна бути додатнім числом або нулем' })
  @Max(1000000, { message: 'Сума не повинна перевищувати 1000000' })
  sum: number | null;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Сума повинна бути додатнім числом або нулем' })
  @Max(1000000, { message: 'Сума не повинна перевищувати 1000000' })
  alreadyPaid: number | null;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  group: string | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsDateString({ message: 'Невірний формат дати для created_at' } as any)
  created_at: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  utm: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  msg: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  manager: string;
}
