import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../core/mail/mail.service';
import { ValidationsService } from '../core/validations/validations.service';
import { MailInterface } from '../core/mail/mail.interface';

@Injectable()
export class ChangePasswordService {
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

    const subject = 'Change your account PASSWORD!!!';
    this.mailService.send(
      user.email,
      subject,
      MailInterface.RESET_PASSWORD,
      mailData,
    );

    return { success: true };
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
