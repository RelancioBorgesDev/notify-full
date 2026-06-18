import {
  NotificationLog as PrismaNotificationLogs,
  $Enums,
} from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  LogStatus,
  NotificationLogs,
} from '@/domain/notification/enterprise/entities/notification-logs';

export class PrismaNotificationLogsMapper {
  static toPrisma(notificationLogs: NotificationLogs) {
    return {
      id: notificationLogs.id.toString(),
      notificationId: notificationLogs.notificationId,
      status: notificationLogs.status as $Enums.LogStatus,
      response: notificationLogs.response,
      errorMessage: notificationLogs.errorMessage,
      attempt: notificationLogs.attempt,
      sentAt: notificationLogs.sentAt,
    };
  }

  static toDomain(raw: PrismaNotificationLogs): NotificationLogs {
    return NotificationLogs.create(
      {
        notificationId: new UniqueEntityID(raw.notificationId),
        attempt: raw.attempt,
        status: raw.status as LogStatus,
        errorMessage: raw.errorMessage,
        response: raw.response ?? undefined,
        sentAt: raw.sentAt,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
