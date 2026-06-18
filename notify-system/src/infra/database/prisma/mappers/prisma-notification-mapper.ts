import { Notification as PrismaNotification, $Enums } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '@/domain/notification/enterprise/entities/notification';
import { NotificationContent } from '@/domain/notification/enterprise/value-object/notification-content';

type NotificationWithRelations = PrismaNotification & {
  recipient: {
    email: string;
  };
};

export class PrismaNotificationMapper {
  static toPrisma(notification: Notification) {
    return {
      id: notification.id.toString(),
      senderId: notification.senderId?.toString(),
      templateId: notification.templateId?.toString(),
      recipientId: notification.recipientId.toString(),
      channel: notification.channel,
      title: notification.title,
      content: notification.content,
      status: notification.status as $Enums.NotificationStatus,
      priority: notification.priority,
      retries: notification.retries,
      error: notification.error,
      readAt: notification.readAt,
      scheduledAt: notification.scheduledAt,
      createdAt: notification.createdAt,
    };
  }

  static toDomain(raw: NotificationWithRelations): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        templateId: new UniqueEntityID(raw.templateId!),
        channel: raw.channel as Channel,
        title: raw.title,
        content: NotificationContent.create(raw.content),
        status: raw.status as NotificationStatus,
        priority: raw.priority,
        retries: raw.retries,
        error: raw.error ?? undefined,
        readAt: raw.readAt,
        scheduledAt: raw.scheduledAt,
        createdAt: raw.createdAt,
        recipientData: raw.recipient,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
