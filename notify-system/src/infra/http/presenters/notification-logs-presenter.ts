import { NotificationLogs } from '@/domain/notification/enterprise/entities/notification-logs';

export class NotificationLogsPresenter {
  static toHTTP(log: NotificationLogs) {
    return {
      id: log.id.toString(),
      notificationId: log.notificationId.toString(),
      attempt: log.attempt,
      response: log.response,
      status: log.status,
      errorMessage: log.errorMessage,
      sentAt: log.sentAt.toISOString(),
    };
  }
}
