import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Users } from '@prisma/client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Метод перевірки дозволу на доступ до маршруту
  canActivate(context: ExecutionContext): boolean {
    // Отримання списку необхідних ролей з маршруту, які були вказані за допомогою декоратора @Roles()
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;
    } // Якщо необхідні ролі не вказані для цього маршруту, то дозвіл на доступ є

    const request = context.switchToHttp().getRequest(); // Отримання запиту з контексту виконання
    const user: Users = request.user; // Отримання користувача з запиту

    if (!user) {
      return false;
    } // Якщо користувач не аутентифікований, то він не має доступу

    if (requiredRoles.includes(user.roles)) {
      return true;
    } // Перевірка, чи має користувач необхідні ролі для доступу до маршруту

    return false; // Якщо не має, то відмова в доступі
  }
}
