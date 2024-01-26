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

@ApiTags('Change-pass')
@Controller('change-pass')
export class ChangePasswordController {
  constructor(private changePasswordService: ChangePasswordService) {}

  @Patch('change-password-generate-token')
  @ApiOperation({ summary: 'Generate token for changing password' })
  async ChangePasswordGenerateToken(
    @Body() changePasswordDto: { email: string },
    @Res() res: any,
  ) {
    try {
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

  @Patch('change-password/:token')
  @ApiOperation({ summary: 'Change user password' })
  async changePasswordUser(
    @Param('token') token: string,
    @Body() changePasswordDto: { newPassword: string },
    @Res() res: any,
  ) {
    try {
      const result = await this.changePasswordService.changePassword(
        token,
        changePasswordDto.newPassword,
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
