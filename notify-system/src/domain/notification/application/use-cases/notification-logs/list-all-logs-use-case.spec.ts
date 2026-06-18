import { ListAllLogsUseCase } from './list-all-logs-use-case';
import { InMemoryLogsRepository } from 'test/repositories/in-memory-logs-repository';
import {
  LogStatus,
  NotificationLogs,
} from '@/domain/notification/enterprise/entities/notification-logs';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let logsRepository: InMemoryLogsRepository;
let listNotificationLogsUseCase: ListAllLogsUseCase;

describe('List Notifications Logs Use Case', () => {
  beforeEach(() => {
    logsRepository = new InMemoryLogsRepository();
    listNotificationLogsUseCase = new ListAllLogsUseCase(logsRepository);
  });

  it('should be able to list all the logs', async () => {
    const log1 = NotificationLogs.create({
      notificationId: new UniqueEntityID('notificationId'),
      attempt: 1,
      errorMessage: 'error',
      response: 'response',
      sentAt: new Date(),
      status: LogStatus.SUCCESS,
    });

    const log2 = NotificationLogs.create({
      notificationId: new UniqueEntityID('notificationId'),
      attempt: 1,
      errorMessage: 'error',
      response: 'response',
      sentAt: new Date(),
      status: LogStatus.SUCCESS,
    });

    await logsRepository.create(log1);
    await logsRepository.create(log2);
    const { logs } = await listNotificationLogsUseCase.execute();

    expect(logs).toHaveLength(2);
    expect(logs.some((l) => l.id.equals(log1.id))).toBe(true);
    expect(logs.some((l) => l.id.equals(log2.id))).toBe(true);
  });
});
