import {
  MailService,
  SendMailInput,
} from '@/domain/notification/application/services/mail-service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EnvService } from '../../env/env.service';

@Injectable()
export class NodemailerMailClient implements MailService, OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private readonly envService: EnvService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.envService.get('SMTP_HOST'),
      port: this.envService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.envService.get('SMTP_USER'),
        pass: this.envService.get('SMTP_PASS'),
      },
    });
  }

  async sendMail({ to, subject, text, html }: SendMailInput): Promise<void> {
    await this.transporter.sendMail({
      from: '"Notify System" <no-reply@notify.com>',
      to,
      subject,
      text, 
      html,
    });
  }
}
