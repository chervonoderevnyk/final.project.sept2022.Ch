import { BadRequestException, Injectable } from '@nestjs/common';
import { Course, CourseFormat, CourseType, Status } from '@prisma/client';

@Injectable()
export class ValidationsService {
  validateCourse(course: string): Course {
    if (!Object.values(Course).includes(course as Course)) {
      const validValues = Object.values(Course).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "course". Курси можуть бути тільки такими: ${validValues}`,
      );
    }
    return course as Course;
  }

  validateCourseFormat(courseFormat: string): CourseFormat {
    if (!Object.values(CourseFormat).includes(courseFormat as CourseFormat)) {
      const validValues = Object.values(CourseFormat).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "courseFormat". Формат курсу може бути тільки таким: ${validValues}`,
      );
    }
    return courseFormat as CourseFormat;
  }

  validateCourseType(courseType: string): CourseType {
    if (!Object.values(CourseType).includes(courseType as CourseType)) {
      const validValues = Object.values(CourseType).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "courseType". Типи курсу можуть бути тільки такими: ${validValues}`,
      );
    }
    return courseType as CourseType;
  }

  validateStatus(status: string): Status {
    if (!Object.values(Status).includes(status as Status)) {
      const validValues = Object.values(Status).join(', ');
      throw new BadRequestException(
        `Недопустиме значення для поля "status". Статус може бути тільки таким: ${validValues}`,
      );
    }
    return status as Status;
  }
}
