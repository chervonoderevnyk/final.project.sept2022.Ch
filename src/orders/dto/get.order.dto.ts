import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SortOrderByInput {
  id: SortOrder;
  name: SortOrder;
  surname: SortOrder;
  email: SortOrder;
  phone: SortOrder;
  age: NullsOrder;
  course: SortOrder;
  course_format: SortOrder;
  course_type: SortOrder;
  status: SortOrder;
  sum: NullsOrder;
  alreadyPaid: NullsOrder;
  group: SortOrder;
  created_at: NullsOrder;
  utm: SortOrder;
  msg: SortOrder;
  manager: SortOrder;
}

export enum SortOrder {
  desc = 'desc',
  asc = 'asc',
}

export enum NullsOrder {
  first = 'first',
  last = 'last',
}
