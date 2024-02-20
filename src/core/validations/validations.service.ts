import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Course, CourseFormat, CourseType, Status } from '@prisma/client';

import { UpdateOrderDto } from '../../orders/dto/update.order.dto';
import { badWordsList } from '../words/bed.words.list';

@Injectable()
export class ValidationsService {
  validateUpdateOrder(updateOrderDto: UpdateOrderDto, order: any, user: any) {
    this.validateLastName(updateOrderDto, order, user);
    this.validateUpdateOrderData(updateOrderDto, order, user);
  }

  validateLastName(updateOrderDto: UpdateOrderDto, order: any, user: any) {
    if (order.status === Status.New) {
      return;
    }

    if (
      (!order.manager &&
        updateOrderDto.manager &&
        updateOrderDto.manager !== user.lastName) ||
      (order.manager &&
        updateOrderDto.manager &&
        updateOrderDto.manager !== user.lastName) ||
      (order.manager && order.manager !== user.lastName)
    ) {
      throw new BadRequestException(
        'Ви не маєте дозволу для змін у цьому order!',
      );
    }

    if (order.manager && order.manager !== user.lastName) {
      throw new UnauthorizedException(
        'Ви не маєте дозволу для змін у цьому order',
      );
    }

    updateOrderDto.manager = user.lastName;
  }

  validateUpdateOrderData(
    updateOrderDto: UpdateOrderDto,
    order: any,
    user: any,
  ) {
    if (updateOrderDto.hasOwnProperty('course')) {
      updateOrderDto.course = this.validateCourse(updateOrderDto.course);
    }
    if (updateOrderDto.hasOwnProperty('course_format')) {
      updateOrderDto.course_format = this.validateCourseFormat(
        updateOrderDto.course_format,
      );
    }
    if (updateOrderDto.hasOwnProperty('course_type')) {
      updateOrderDto.course_type = this.validateCourseType(
        updateOrderDto.course_type,
      );
    }

    if (updateOrderDto.hasOwnProperty('status')) {
      updateOrderDto.status = this.validateStatus(
        updateOrderDto.status || 'In_work',
      );
    }
  }

  validateCourse(course: string): Course {
    if (!Object.values(Course).includes(course as Course)) {
      const validValues = Object.values(Course).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "course". "course" може бути тільки таким: ${validValues}`,
      );
    }
    return course as Course;
  }

  validateCourseFormat(courseFormat: string): CourseFormat {
    if (!Object.values(CourseFormat).includes(courseFormat as CourseFormat)) {
      const validValues = Object.values(CourseFormat).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "courseFormat". "courseFormat" може бути тільки таким: ${validValues}`,
      );
    }
    return courseFormat as CourseFormat;
  }

  validateCourseType(courseType: string): CourseType {
    if (!Object.values(CourseType).includes(courseType as CourseType)) {
      const validValues = Object.values(CourseType).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "courseType". "courseType" може бути тільки таким: ${validValues}`,
      );
    }
    return courseType as CourseType;
  }

  validateStatus(status: string): Status {
    if (!Object.values(Status).includes(status as Status)) {
      const validValues = Object.values(Status).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "status". "status" може бути тільки таким: ${validValues}`,
      );
    }
    return status as Status;
  }

  validatePasswordLength(password: string) {
    const minLength = 5;
    const maxLength = 20;

    if (password.length < minLength || password.length > maxLength) {
      throw new HttpException(
        { message: 'Некоректні дані користувача' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  checkForBadWords(text: string): string {
    let filteredText = text;

    badWordsList.forEach((badWord) => {
      const regex = new RegExp(badWord, 'gi');
      filteredText = filteredText.replace(regex, '*** (страшне матюччя)');
    });

    return filteredText;
  }

  validateExtraField(dto: Record<string, any>, allowedFields: string[]) {
    const extraFields = Object.keys(dto).filter(
      (key) => !allowedFields.includes(key),
    );

    if (extraFields.length > 0) {
      const errorMessage = `Знайдено непередбачені поля у запиті: ${extraFields.join(
        ', ',
      )}`;
      throw new BadRequestException(errorMessage);
    }
  }
}
