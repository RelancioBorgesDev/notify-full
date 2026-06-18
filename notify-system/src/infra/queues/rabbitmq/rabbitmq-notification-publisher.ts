import { Injectable } from '@nestjs/common';
import { RabbitMQClient } from './rabbitmq-client';

@Injectable()
export class RabbitMQNotificationPublisher {
  private readonly queueName = 'notifications';

  constructor(private readonly rabbitClient: RabbitMQClient) {}

  async publish(notification: {
    id: string;
    senderId?: string;
    recipientId: string;
    templateId?: string;
    title: string;
    content: string;
    channel: string;
    priority: number;
    scheduledAt?: string | null;
  }) {
    await this.rabbitClient.assertQueue(this.queueName, {
      durable: true,
      maxPriority: 10,
    });

    await this.rabbitClient.sendToQueue(this.queueName, notification, {
      persistent: true,
      priority: notification.priority,
    });
  }
}
