import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '../../enterprise/entities/notification';
import { NotificationContent } from '../../enterprise/value-object/notification-content';
import { RabbitMQNotificationPublisher } from '@/infra/queues/rabbitmq/rabbitmq-notification-publisher';
interface CreateNotificationRequest {
  senderId?: UniqueEntityID | null;
  recipientId: UniqueEntityID;
  templateId?: UniqueEntityID | null; 
  channel: Channel;
  title: string;
  content: string;
  priority: number;
  scheduledAt?: Date | null;
}

interface CreateNotificationResponse {
  notification: Notification;
}

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private notificationRepository: NotificationsRepository,
    private readonly publisher: RabbitMQNotificationPublisher,
  ) {}

  async execute({
    senderId,
    recipientId,
    title,
    content,
    priority,
    channel,
    templateId,
    scheduledAt,
  }: CreateNotificationRequest): Promise<CreateNotificationResponse> {
    const notificationContent = NotificationContent.create(content);

    const notification = Notification.create({
      recipientId,
      templateId,
      content: notificationContent,
      priority,
      title,
      channel,
      scheduledAt: scheduledAt ?? null,

      status: NotificationStatus.PENDING,
      readAt: null,
      retries: 0,
      error: undefined,
    });

    await this.notificationRepository.create(notification);
    await this.publisher.publish({
      id: notification.id.toString(),
      senderId: senderId?.toString() ?? undefined,
      recipientId: recipientId.toString(),
      templateId: templateId?.toString() ?? undefined,
      title,
      content,
      channel,
      priority,
      scheduledAt: scheduledAt?.toISOString() ?? null,
    });

    return { notification };
  }
}
