import { Injectable } from '@nestjs/common';
import { GetNotificationTemplateByIdUseCase } from './notification-template/get-template-by-id-use-case';
import { LogNotificationAttemptUseCase } from './notification-logs/log-notification-attempt-use-case';
import { SaveNotificationUseCase } from './save-notification-use-case';
import { GetNotificationLogsUseCaseUseCase } from './notification-logs/get-notification-logs-use-case';
import { MailService } from '../services/mail-service';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Notification,
  NotificationStatus,
} from '../../enterprise/entities/notification';
import { LogStatus } from '../../enterprise/entities/notification-logs';
import { GetRecipientByIdUseCase } from '../../../recipients/application/use-cases/get-recipient-by-id-use-case';

@Injectable()
export class ProcessNotificationUseCase {
  constructor(
    private readonly getNotificationTemplateById: GetNotificationTemplateByIdUseCase,
    private readonly logNotificationAttempt: LogNotificationAttemptUseCase,
    private readonly saveNotification: SaveNotificationUseCase,
    private readonly getNotificationLogs: GetNotificationLogsUseCaseUseCase,
    private readonly getRecipientByIdUseCase: GetRecipientByIdUseCase,
    private readonly mailService: MailService,
  ) {}

  async execute(notificationData: Notification) {
    const notificationId = new UniqueEntityID(notificationData.id.toString());
    const attempt = await this.getNextAttempt(notificationId);

    try {
      if (!notificationData.templateId) {
        throw new Error('TemplateId is required');
      }
      const { template } = await this.getNotificationTemplateById.execute({
        templateId: notificationData.templateId,
      });

      const { recipient } = await this.getRecipientByIdUseCase.execute({
        id: notificationData.recipientId,
      });

      await this.mailService.sendMail({
        to: recipient.email,
        subject: template.subject!,
        text: notificationData.content,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5; padding: 16px;">
            <h2 style="color: #4f46e5;">📢 Notify System</h2>
            <p>${notificationData.content}</p>
            <hr style="margin: 20px 0;" />
            <p style="font-size: 12px; color: #666;">
              Este é um e-mail automático, por favor não responda.
            </p>
          </div>
        `,
      });

      await this.logNotificationAttempt.execute({
        notificationId,
        attempt,
        status: LogStatus.SUCCESS,
        sentAt: new Date(),
        response: 'Notificação enviada com sucesso.',
      });

      await this.saveNotification.execute({
        id: notificationId,
        updates: { status: NotificationStatus.SENT },
      });
    } catch (error) {
      await this.logNotificationAttempt.execute({
        notificationId,
        attempt,
        status: LogStatus.FAIL,
        sentAt: new Date(),
        errorMessage: error.message,
      });

      await this.saveNotification.execute({
        id: notificationId,
        updates: { status: NotificationStatus.FAILED },
      });

      throw error;
    }
  }

  private async getNextAttempt(
    notificationId: UniqueEntityID,
  ): Promise<number> {
    const { notificationLogs } = await this.getNotificationLogs.execute({
      notificationId,
    });
    if (notificationLogs.length === 0) return 1;
    return Math.max(...notificationLogs.map((log) => log.attempt)) + 1;
  }
}
