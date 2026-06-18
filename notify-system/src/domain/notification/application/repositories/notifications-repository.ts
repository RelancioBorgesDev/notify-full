import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Notification } from '../../enterprise/entities/notification';

export abstract class NotificationsRepository {
  abstract findById(id: UniqueEntityID): Promise<Notification | null>;
  abstract findManyByRecipientId(
    recipientId: UniqueEntityID,
  ): Promise<Notification[]>;
  abstract findScheduledNotifications(now: Date): Promise<Notification[]>;

  abstract create(notification: Notification): Promise<void>;
  abstract listAll(): Promise<Notification[]>;
  abstract save(notification: Notification): Promise<void>;
  abstract delete(notificationId: UniqueEntityID): Promise<void>;
}
