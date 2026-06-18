import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQClient } from './rabbitmq-client';
import { ConsumeMessage } from 'amqplib';
import { ProcessNotificationUseCase } from '@/domain/notification/application/use-cases/process-notification-use-case';

@Injectable()
export class RabbitMQNotificationConsumer implements OnModuleInit {
  private readonly queueName = 'notifications';

  constructor(
    private readonly rabbitClient: RabbitMQClient,
    private readonly processNotificationUseCase: ProcessNotificationUseCase,
  ) {}

  async onModuleInit() {
    await this.rabbitClient.assertQueue(this.queueName, {
      durable: true,
      maxPriority: 10,
    });

    await this.rabbitClient.consume(this.queueName, this.onMessage, {
      noAck: false,
    });
  }

  private onMessage = async (message: ConsumeMessage | null) => {
    if (!message) return;

    try {
      const data = JSON.parse(message.content.toString());
      await this.processNotificationUseCase.execute(data);
      this.rabbitClient.getChannel().ack(message);
    } catch (error) {
      console.error('❌ Error processing message:', error);
      this.rabbitClient.getChannel().nack(message, false, true);
    }
  };
}
