import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class InMemoryNotificationRepository implements NotificationsRepository {
  private notifications: Notification[] = [];

  async listAll(): Promise<Notification[]> {
    return [...this.notifications];
  }
  async findById(id: UniqueEntityID): Promise<Notification | null> {
    const notification = this.notifications.find((noti) => noti.id.equals(id));

    return notification ?? null;
  }

  async findManyByRecipientId(
    recipientId: UniqueEntityID,
  ): Promise<Notification[]> {
    const recipienteNotifications = this.notifications.filter((noti) =>
      noti.recipientId.equals(recipientId),
    );

    return recipienteNotifications;
  }

  async findScheduledNotifications(now: Date): Promise<Notification[]> {
    const scheduledNotifications = this.notifications.filter((noti) => {
      noti.scheduledAt?.getTime() == now.getTime();
    });

    return scheduledNotifications;
  }

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const index = this.notifications.findIndex((n) =>
      n.id.equals(notification.id),
    );
    if (index >= 0) {
      this.notifications[index] = notification;
    } else {
      this.notifications.push(notification);
    }
  }

  async delete(notificationId: UniqueEntityID): Promise<void> {
    this.notifications = this.notifications.filter(
      (noti) => !noti.id.equals(notificationId),
    );
  }
}
