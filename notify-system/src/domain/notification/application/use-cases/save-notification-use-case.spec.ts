import { describe } from 'node:test';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '../../enterprise/entities/notification';
import { NotificationTemplate } from '../../enterprise/entities/notification-template';
import { User } from '../../../users/enterprise/entities/user';
import { InMemoryNotificationRepository } from '../../../../../test/repositories/in-memory-notification-repository';
import { SaveNotificationUseCase } from './save-notification-use-case';
import { NotificationContent } from '../../enterprise/value-object/notification-content';

let notificationsRepository: InMemoryNotificationRepository;
let sut: SaveNotificationUseCase;

describe('Save Notification Use Case', () => {
  beforeAll(() => {
    notificationsRepository = new InMemoryNotificationRepository();
    sut = new SaveNotificationUseCase(notificationsRepository);
  });

  it('should be able to update a notification', async () => {
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

    await sut.execute({
      id: notification.id,
      updates: {
        status: 'SENT' as NotificationStatus.SENT,
      },
    });

    const findedNotification = await notificationsRepository.findById(
      notification.id,
    );

    expect(notification).toBeTruthy();
    expect(notification.channel).toBe(Channel.EMAIL);
    expect(findedNotification!.status).toBe(NotificationStatus.SENT);
    expect(notification.recipientId.equals(user.id)).toBe(true);
    expect(notification.templateId.equals(template.id)).toBe(true);
  });

  it('should update multiple fields when provided', async () => {
    // Arrange
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

    const notification = Notification.create({
      recipientId: user.id,
      templateId: template.id,
      channel: Channel.EMAIL,
      title: 'Original Title',
      content: NotificationContent.create('Original Content'),
      priority: 1,
      scheduledAt: null,
      status: NotificationStatus.PENDING,
      retries: 0,
    });

    await notificationsRepository.create(notification);

    // Act
    const newTitle = 'Updated Title';
    const newContent = 'Updated Content';
    const newStatus = NotificationStatus.SENT;

    await sut.execute({
      id: notification.id,
      updates: {
        title: newTitle,
        content: NotificationContent.create(newContent),
        status: newStatus,
        retries: 1,
      },
    });

    // Assert
    const updatedNotification = await notificationsRepository.findById(
      notification.id,
    );

    expect(updatedNotification!.title).toBe(newTitle);
    expect(updatedNotification!.content).toBe(newContent);
    expect(updatedNotification!.status).toBe(newStatus);
    expect(updatedNotification!.retries).toBe(1);
  });
});
