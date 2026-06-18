import { LogNotificationAttemptUseCase } from './log-notification-attempt-use-case';
import { InMemoryNotificationRepository } from '../../../../../../test/repositories/in-memory-notification-repository';
import { InMemoryLogsRepository } from '../../../../../../test/repositories/in-memory-logs-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { User } from '@/domain/users/enterprise/entities/user';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { NotificationContent } from '@/domain/notification/enterprise/value-object/notification-content';
import {
  Channel,
  NotificationStatus,
} from '@/domain/notification/enterprise/entities/notification';
import { LogStatus } from '@/domain/notification/enterprise/entities/notification-logs';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let notificationsRepository: InMemoryNotificationRepository;
let logsRepository: InMemoryLogsRepository;
let sut: LogNotificationAttemptUseCase;

describe('Log Notification Attempt Use Case', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationRepository();
    logsRepository = new InMemoryLogsRepository();
    sut = new LogNotificationAttemptUseCase(
      logsRepository,
      notificationsRepository,
    );
  });

  it('should log a notification attempt successfully', async () => {
    const user = User.create({
      email: 'test@example.com',
      name: 'User 1',
      passwordHash: '123456',
    });

    const template = NotificationTemplate.create({
      title: 'Welcome!',
      content: 'Thanks for signing up.',
      channel: Channel.EMAIL,
      subject: 'Welcome!',
    });

    const notificationContent =
      NotificationContent.create('Email body content');

    const notification = Notification.create({
      recipientId: user.id,
      templateId: template.id,
      channel: Channel.EMAIL,
      title: 'Test Notification',
      content: notificationContent,
      priority: 1,
      scheduledAt: null,
      status: NotificationStatus.PENDING,
      retries: 0,
    });

    await notificationsRepository.create(notification);

    const sentAt = new Date();

    const result = await sut.execute({
      notificationId: notification.id,
      status: LogStatus.SUCCESS,
      response: 'OK',
      errorMessage: null,
      attempt: 1,
      sentAt,
    });

    expect(result.log).toBeTruthy();
    expect(result.log.notificationId.toString()).toBe(
      notification.id.toString(),
    );
    expect(result.log.status).toBe(LogStatus.SUCCESS);
    expect(result.log.response).toBe('OK');
    expect(result.log.errorMessage).toBe('');
    expect(result.log.attempt).toBe(1);
    expect(result.log.sentAt).toBe(sentAt);
  });

  it('should throw if notification does not exist', async () => {
    const invalidNotificationId = new UniqueEntityID();

    await expect(() =>
      sut.execute({
        notificationId: invalidNotificationId,
        status: LogStatus.FAIL,
        errorMessage: 'SMTP error',
        attempt: 1,
        sentAt: new Date(),
      }),
    ).rejects.toThrow(
      `Notification with ID ${invalidNotificationId.toString()} not found`,
    );
  });
});
