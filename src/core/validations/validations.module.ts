import { Module } from '@nestjs/common';

import { ValidationsService } from './validations.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    AuthModule, // Додав цей рядок
  ],
  providers: [ValidationsService],
  exports: [ValidationsService],
})
export class ValidationsModule {}
