import { describe } from 'node:test';
import { CreateNotificationUseCase } from './create-notification-use-case';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '../../enterprise/entities/notification';
import { NotificationTemplate } from '../../enterprise/entities/notification-template';
import { User } from '../../../users/enterprise/entities/user';
import { InMemoryNotificationRepository } from '../../../../../test/repositories/in-memory-notification-repository';
import { DeleteNotificationUseCase } from './delete-notification-use-case';
import { NotificationContent } from '../../enterprise/value-object/notification-content';

let notificationsRepository: InMemoryNotificationRepository;
let sut: DeleteNotificationUseCase;

describe('Delete Notification Use Case', () => {
  beforeAll(() => {
    notificationsRepository = new InMemoryNotificationRepository();
    sut = new DeleteNotificationUseCase(notificationsRepository);
  });

  it('should be able to delete a notification', async () => {
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

    const notificationContent = NotificationContent.create(
      'This is a test notification 2',
    );
    
    const notification = Notification.create({
      recipientId: user.id,
      templateId: template.id,
      channel: Channel.EMAIL,
      title: 'Test2 Notification',
      content: notificationContent,
      priority: 1,
      scheduledAt: null,
      status: 'PENDING' as NotificationStatus.PENDING,
      retries: 0,
    });

    await notificationsRepository.create(notification);

    await sut.execute({ notificationId: notification.id });

    const found = await notificationsRepository.findById(notification.id);
    expect(found).toBeNull();
  });
});
