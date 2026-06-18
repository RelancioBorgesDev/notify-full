import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class NotificationsPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id,
      senderId: notification.senderId,
      recipientId: notification.recipientId,
      templateId: notification.templateId,
      title: notification.title,
      channel: notification.channel,
      content: notification.content,
      status: notification.status,
      priority: notification.priority,
      retries: notification.retries,
      error: notification.error,
      scheduledAt: notification.scheduledAt,
      createdAt: notification.createdAt,
      recipientData: notification.recipientData,
    };
  }
}
