import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ChangePasswordService } from './change-password.service';
import { ChangePasswordDto } from './dto/change.password.dto';
import { ValidationsService } from '../core/validations/validations.service';

@ApiTags('Change-pass')
@Controller('change-pass')
export class ChangePasswordController {
  constructor(
    private changePasswordService: ChangePasswordService,
    private validationsService: ValidationsService,
  ) {}

  // Генерує токен для зміни пароля
  @Patch('change-password-generate-token')
  @ApiOperation({ summary: 'Generate token for changing password' })
  async ChangePasswordGenerateToken(
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: any,
  ) {
    try {
      // Перевірка на кількість спроб на зміну паролю
      if (
        !this.changePasswordService.canChangePassword(changePasswordDto.email)
      ) {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          message: 'Перевищено кількість спроб зміни паролю за добу.',
        });
      }

      // Запис спроби в сервіс
      this.changePasswordService.recordChangePasswordAttempt(
        changePasswordDto.email,
      );

      const expectedFields = ['email'];

      const invalidFields = Object.keys(changePasswordDto).filter(
        (key) => !expectedFields.includes(key),
      );

      if (invalidFields.length > 0) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Знайдено непередбачені поля у запиті: ${invalidFields.join(
            ', ',
          )}`,
        });
      }

      const result =
        await this.changePasswordService.generateChangePasswordToken(
          changePasswordDto.email,
        );

      if (result.success) {
        return res.status(HttpStatus.OK).json({
          message: 'Токен для зміни пароля згенеровано. Перевірте ваш email.',
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: result.message,
        });
      }
    } catch (error) {
      // console.error('Change Password Error:', error);

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Помилка при зміні пароля',
      });
    }
  }

  // Змінює пароль користувача
  @Patch('change-password/:token')
  @ApiOperation({ summary: 'Change user password' })
  async changePasswordUser(
    @Param('token') token: string,
    @Body() changeOldPasswordDto: { newPassword: string },
    @Res() res: any,
  ) {
    try {
      const expectedFields = ['newPassword'];

      const invalidFields = Object.keys(changeOldPasswordDto).filter(
        (key) => !expectedFields.includes(key),
      );

      if (invalidFields.length > 0) {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: `Знайдено непередбачені поля у запиті: ${invalidFields.join(
            ', ',
          )}`,
        });
      }

      // Валідація нового пароля
      this.validationsService.validatePasswordLength(
        changeOldPasswordDto.newPassword,
      );

      const result = await this.changePasswordService.changePassword(
        token,
        changeOldPasswordDto.newPassword,
      );

      if (result.success) {
        return res.status(HttpStatus.OK).json({
          message: 'Пароль користувача успішно оновлено.',
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: result.message,
        });
      }
    } catch (error) {
      // console.error('Update Password Error:', error);

      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Помилка при оновленні пароля',
      });
    }
  }
}
