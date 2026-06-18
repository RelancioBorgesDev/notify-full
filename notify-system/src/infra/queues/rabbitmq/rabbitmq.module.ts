import { forwardRef, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQNotificationPublisher } from './rabbitmq-notification-publisher';
import { RabbitMQClient } from './rabbitmq-client';
import { RabbitMQNotificationConsumer } from './rabbitmq-notification-consumer';
import { NotificationDomainModule } from '@/domain/notification/notification-domain.module';
import { MailModule } from '@/infra/mail/mail.module';

const rabbitMQClientProvider: Provider = {
  provide: RabbitMQClient,
  useFactory: async (configService: ConfigService) => {
    const client = new RabbitMQClient();
    const url = configService.get<string>('RABBITMQ_URL');
    await client.connect(url);
    return client;
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => NotificationDomainModule),
    MailModule,
  ],
  providers: [
    rabbitMQClientProvider,
    RabbitMQNotificationPublisher,
    RabbitMQNotificationConsumer,
  ],
  exports: [RabbitMQNotificationPublisher, RabbitMQNotificationConsumer],
})
export class RabbitMQModule {}
