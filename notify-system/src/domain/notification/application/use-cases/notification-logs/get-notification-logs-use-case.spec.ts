import { describe } from 'node:test';
import { InMemoryLogsRepository } from '../../../../../../test/repositories/in-memory-logs-repository';
import { GetNotificationLogsUseCaseUseCase } from './get-notification-logs-use-case';
import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification-repository';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '@/domain/notification/enterprise/entities/notification';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { User } from '@/domain/users/enterprise/entities/user';
import { NotificationContent } from '@/domain/notification/enterprise/value-object/notification-content';
import {
  LogStatus,
  NotificationLogs,
} from '@/domain/notification/enterprise/entities/notification-logs';

let notificationsLogsRepository: InMemoryLogsRepository;
let notificationsRepository: InMemoryNotificationRepository;
let sut: GetNotificationLogsUseCaseUseCase;

describe('Get Notification Logs Use Case', () => {
  beforeAll(() => {
    notificationsLogsRepository = new InMemoryLogsRepository();
    notificationsRepository = new InMemoryNotificationRepository();
    sut = new GetNotificationLogsUseCaseUseCase(
      notificationsLogsRepository,
      notificationsRepository,
    );
  });

  it('should be able to get all the logs from the notification', async () => {
    const user = User.create({
      email: 'user1@example.com',
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

    const log1 = NotificationLogs.create({
      notificationId: notification.id,
      status: LogStatus.SUCCESS,
      response: 'OK',
      attempt: 1,
      sentAt: new Date(),
    });

    const log2 = NotificationLogs.create({
      notificationId: notification.id,
      status: LogStatus.FAIL,
      response: 'Failed',
      errorMessage: 'SMTP error',
      attempt: 2,
      sentAt: new Date(),
    });

    await notificationsLogsRepository.create(log1);
    await notificationsLogsRepository.create(log2);

    const result = await sut.execute({
      notificationId: notification.id,
    });

    expect(result.notificationLogs).toHaveLength(2);
    expect(result.notificationLogs.map((log) => log.status)).toEqual([
      LogStatus.SUCCESS,
      LogStatus.FAIL,
    ]);
  });
});
