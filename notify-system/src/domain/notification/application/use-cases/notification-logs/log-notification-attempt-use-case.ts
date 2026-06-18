import { Injectable } from '@nestjs/common';
import { NotificationLogsRepository } from '../../repositories/notification-logs-repository';
import {
  LogStatus,
  NotificationLogs,
} from '@/domain/notification/enterprise/entities/notification-logs';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '../../repositories/notifications-repository';

interface LogNotificationAttemptUseCaseRequest {
  notificationId: UniqueEntityID;
  status: LogStatus;
  response?: string;
  errorMessage?: string | null;
  attempt: number;
  sentAt: Date;
}

interface LogNotificationAttemptUseCaseResponse {
  log: NotificationLogs;
}

@Injectable()
export class LogNotificationAttemptUseCase {
  constructor(
    private notificationLogsRepository: NotificationLogsRepository,
    private notificationRepository: NotificationsRepository,
  ) {}

  async execute({
    attempt,
    notificationId,
    sentAt,
    status,
    errorMessage,
    response,
  }: LogNotificationAttemptUseCaseRequest): Promise<LogNotificationAttemptUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new Error(
        `Notification with ID ${notificationId.toString()} not found`,
      );
    }

    const log = NotificationLogs.create({
      notificationId,
      attempt,
      sentAt,
      status,
      errorMessage: errorMessage ?? '',
      response: response ?? '',
    });

    await this.notificationLogsRepository.create(log);

    return { log };
  }
}
