import { NotificationLogs } from '../../enterprise/entities/notification-logs';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export abstract class NotificationLogsRepository {
  abstract delete(logId: UniqueEntityID): Promise<void>;
  abstract deleteManyByNotificationId(notificationId: UniqueEntityID): Promise<void>;
  abstract listAll(): Promise<NotificationLogs[]>;
  abstract findById(logId: UniqueEntityID): Promise<NotificationLogs | null>;
  abstract findManyByNotificationId(
    notificationId: UniqueEntityID,
  ): Promise<NotificationLogs[]>;
  abstract create(log: NotificationLogs): Promise<void>;
}
