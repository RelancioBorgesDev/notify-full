import { ProcessNotificationUseCase } from './process-notification-use-case';
import { GetNotificationTemplateByIdUseCase } from './notification-template/get-template-by-id-use-case';
import { LogNotificationAttemptUseCase } from './notification-logs/log-notification-attempt-use-case';
import { SaveNotificationUseCase } from './save-notification-use-case';
import { GetNotificationLogsUseCaseUseCase } from './notification-logs/get-notification-logs-use-case';
import { MailService } from '../services/mail-service';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '../../enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LogStatus } from '../../enterprise/entities/notification-logs';
import { InMemoryNotificationRepository } from 'test/repositories/in-memory-notification-repository';
import { InMemoryNotificationTemplateRepository } from 'test/repositories/in-memory-notification-template-repository';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import { NotificationTemplate } from '../../enterprise/entities/notification-template';
import { NotificationContent } from '../../enterprise/value-object/notification-content';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id-use-case';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';
import { Recipient } from '@/domain/recipients/enterprise/entities/recipient';
import { User, UserStatus } from '@/domain/users/enterprise/entities/user';
import { GetRecipientByIdUseCase } from '@/domain/recipients/application/use-cases/get-recipient-by-id-use-case';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient';

let notificationsRepository: InMemoryNotificationRepository;
let notificationTemplateRepository: InMemoryNotificationTemplateRepository;
let notificationsLogsRepository: InMemoryLogsRepository;
let recipientRepository: InMemoryRecipientRepository;

let getTemplateByIdUseCase: GetNotificationTemplateByIdUseCase;
let logNotificationAttemptUseCase: LogNotificationAttemptUseCase;
let saveNotificationUseCase: SaveNotificationUseCase;
let getNotificationLogsUseCase: GetNotificationLogsUseCaseUseCase;
let getRecipientByIdUseCase: GetRecipientByIdUseCase;

let mailServiceMock: jest.Mocked<MailService>;
let sut: ProcessNotificationUseCase;

describe('ProcessNotificationUseCase', () => {
  beforeEach(async () => {
    notificationsRepository = new InMemoryNotificationRepository();
    notificationTemplateRepository =
      new InMemoryNotificationTemplateRepository();
    notificationsLogsRepository = new InMemoryLogsRepository();
    recipientRepository = new InMemoryRecipientRepository();

    getTemplateByIdUseCase = new GetNotificationTemplateByIdUseCase(
      notificationTemplateRepository,
    );
    logNotificationAttemptUseCase = new LogNotificationAttemptUseCase(
      notificationsLogsRepository,
      notificationsRepository,
    );
    saveNotificationUseCase = new SaveNotificationUseCase(
      notificationsRepository,
    );
    getNotificationLogsUseCase = new GetNotificationLogsUseCaseUseCase(
      notificationsLogsRepository,
      notificationsRepository,
    );
    getRecipientByIdUseCase = new GetRecipientByIdUseCase(recipientRepository);

    mailServiceMock = { sendMail: jest.fn() } as any;

    sut = new ProcessNotificationUseCase(
      getTemplateByIdUseCase,
      logNotificationAttemptUseCase,
      saveNotificationUseCase,
      getNotificationLogsUseCase,
      getRecipientByIdUseCase,
      mailServiceMock,
    );
  });

  it('should process and send the notification successfully', async () => {
    const user = User.create({
      email: 'test@example.com',
      name: 'User 1',
      passwordHash: '1234',
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

    const recipient = Recipient.create({
      name: 'User 1',
      email: 'test@example.com',
      phone: '123456789',
      pushToken: '123456789',
    });
    await recipientRepository.create(recipient);

    const notification = Notification.create({
      recipientId: recipient.id,
      templateId: template.id,
      channel: Channel.EMAIL,
      title: 'Test2 Notification',
      content: notificationContent,
      priority: 1,
      scheduledAt: null,
      status: 'PENDING' as NotificationStatus.PENDING,
      retries: 0,
    });
    await recipientRepository.create(recipient);

    await notificationTemplateRepository.create(template);

    await notificationsRepository.create(notification);

    await sut.execute(notification);

    const updatedNotification = await notificationsRepository.findById(
      notification.id,
    );

    expect(updatedNotification?.status).toBe(NotificationStatus.SENT);
    const sendMailCalls = (mailServiceMock.sendMail as jest.Mock).mock.calls[0][0];
    expect(sendMailCalls.to).toBe('test@example.com');
    expect(sendMailCalls.subject).toBe('Oferta exclusiva!');
    expect(sendMailCalls.text).toBe('This is a test notification 2');

    const logs = await notificationsLogsRepository.findManyByNotificationId(
      notification.id,
    );
    expect(logs).toHaveLength(1);
    expect(logs[0].status).toBe(LogStatus.SUCCESS);
  });
});
