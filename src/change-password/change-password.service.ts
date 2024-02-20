import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../core/mail/mail.service';
import { ValidationsService } from '../core/validations/validations.service';
import { MailInterface } from '../core/mail/mail.interface';

@Injectable()
export class ChangePasswordService {
  private readonly changePasswordAttempts: Map<string, number> = new Map();

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private mailService: MailService,
    private validationsService: ValidationsService,
  ) {}

  async generateChangePasswordToken(email: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      return { success: false, message: 'Користувача не знайдено' };
    }

    const changePasswordToken = this.authService.generateChangePasswordToken(
      user.id.toString(),
    );
    // console.log('Change Password Token:', changePasswordToken);

    const mailData = {
      lastName: user.lastName,
      firstName: user.firstName,
      changePasswordToken,
    };

    const subject = 'Змінити ПАРОЛЬ до облікового запису!!!';
    this.mailService.send(
      user.email,
      subject,
      MailInterface.RESET_PASSWORD,
      mailData,
    );

    return { success: true };
  }

  canChangePassword(email: string): boolean {
    const key = email.toLowerCase();
    const attempts = this.changePasswordAttempts.get(key) || 0;
    const lastAttemptTime = this.changePasswordAttempts.get(`${key}_time`) || 0;
    const currentTime = new Date().getTime();

    // Визначення кількості дозволених спроб і часовий період (наприклад, 3 спроби за добу)
    const maxAttempts = 3;
    const resetPeriod = 24 * 60 * 60 * 1000; // 24 години в мілісекундах
    // const lockoutPeriod = 5 * 60 * 1000; // 5 хвилин в мілісекундах

    if (
      attempts >= maxAttempts &&
      currentTime - lastAttemptTime < resetPeriod
    ) {
      // Заблоковано через досягнення максимальної кількості спроб, але ще не минув період блокування
      return false;
    }

    if (currentTime - lastAttemptTime >= resetPeriod) {
      // Скидаємо лічильник, якщо пройшов часовий період
      this.changePasswordAttempts.set(key, 0);
      this.changePasswordAttempts.set(`${key}_time`, currentTime);
      return true;
    }

    return true;
  }

  recordChangePasswordAttempt(email: string): void {
    const key = email.toLowerCase();
    const attempts = this.changePasswordAttempts.get(key) || 0;
    this.changePasswordAttempts.set(key, attempts + 1);

    // Ініціалізація часу останньої спроби, якщо він ще не існує
    if (!this.changePasswordAttempts.has(`${key}_time`)) {
      this.changePasswordAttempts.set(`${key}_time`, new Date().getTime());
    }
  }

  async changePassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      return { success: false, message: 'Некоректні дані користувача' };
    }

    const isChangePasswordTokenUsed =
      this.authService.isChangePasswordTokenUsed(token);

    if (isChangePasswordTokenUsed) {
      return { success: false, message: 'Токен зміни пароля вже використано' };
    }

    const isValidToken = this.authService.verifyToken(
      token,
      'changePasswordToken',
    );

    if (!isValidToken) {
      return { success: false, message: 'Некоректний токен зміни пароля' };
    }

    const user = await this.authService.verifyChangePasswordToken(token);

    if (!user.active) {
      return {
        success: false,
        message: 'Користувач не активований. Зміна паролю неможлива.',
      };
    }

    this.validationsService.validatePasswordLength(newPassword);

    this.authService.markChangePasswordTokenAsUsed(token);

    await this.usersService.updateUserPassword(user.id.toString(), newPassword);

    return { success: true };
  }
}
