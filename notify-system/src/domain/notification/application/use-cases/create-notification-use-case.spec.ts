import { describe } from 'node:test';
import { CreateNotificationUseCase } from './create-notification-use-case';
import { Channel } from '../../enterprise/entities/notification';
import { NotificationTemplate } from '../../enterprise/entities/notification-template';
import { User } from '../../../users/enterprise/entities/user';
import { InMemoryNotificationRepository } from '../../../../../test/repositories/in-memory-notification-repository';
import { RabbitMQNotificationPublisher } from '@/infra/queues/rabbitmq/rabbitmq-notification-publisher';

let notificationsRepository: InMemoryNotificationRepository;
let publisher: RabbitMQNotificationPublisher;
let sut: CreateNotificationUseCase;

describe('Create Notification Use Case', () => {
  beforeAll(() => {
    notificationsRepository = new InMemoryNotificationRepository();
    publisher = {
      publish: jest.fn(),
    } as any;

    sut = new CreateNotificationUseCase(notificationsRepository, publisher);
  });

  it('should be able to create a notification', async () => {
    const user = User.create({
      email: 'user1@example.com',
      name: 'User 1',
      passwordHash: 'pass123',
    });

    const template = NotificationTemplate.create({
      title: 'Promoção de Jogo',
      content: 'Aproveite 20% de desconto em todos os produtos!',
      channel: Channel.EMAIL,
      subject: 'Oferta exclusiva!',
    });

    const { notification } = await sut.execute({
      recipientId: user.id,
      templateId: template.id,
      channel: Channel.EMAIL,
      title: 'Test2 Notification',
      content: 'This is a test notification 2',
      priority: 1,
      scheduledAt: null,
    });

    expect(notification).toBeTruthy();
    expect(notification.title).toBe('Test2 Notification');
    expect(notification.content).toBe('This is a test notification 2');
    expect(notification.channel).toBe(Channel.EMAIL);
    expect(notification.recipientId.equals(user.id)).toBe(true);
    expect(notification.templateId.equals(template.id)).toBe(true);

    const found = await notificationsRepository.findById(notification.id);
    expect(found).toEqual(notification);
    expect(publisher.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        recipientId: notification.recipientId.toString(),
        templateId: notification.templateId.toString(),
        channel: Channel.EMAIL,
      }),
    );
  });
});
