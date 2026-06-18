import { Module } from '@nestjs/common';
import { NodemailerMailClient } from './nodemailer/nodemailer-client';
import { EnvModule } from '../env/env.module';
import { MailService } from '@/domain/notification/application/services/mail-service';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: MailService,
      useClass: NodemailerMailClient,
    },
  ],
  exports: [MailService],
})
export class MailModule {}
