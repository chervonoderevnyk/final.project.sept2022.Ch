import { Module } from '@nestjs/common';

import { ValidationsService } from './validations.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ValidationsService],
  exports: [ValidationsService],
})
export class ValidationsModule {}
