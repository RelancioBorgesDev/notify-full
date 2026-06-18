import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationLogsRepository } from '@/domain/notification/application/repositories/notification-logs-repository';
import { NotificationLogs } from '@/domain/notification/enterprise/entities/notification-logs';

export class InMemoryLogsRepository implements NotificationLogsRepository {
  private notificationLogs: NotificationLogs[] = [];

  async delete(logId: UniqueEntityID) {
    this.notificationLogs = this.notificationLogs.filter(
      (log) => log.id.toString() !== logId.toString(),
    );
  }
  async deleteManyByNotificationId(notificationId: UniqueEntityID) {
    this.notificationLogs = this.notificationLogs.filter(
      (log) => log.notificationId.toString() !== notificationId.toString(),
    );
  }
  async listAll(): Promise<NotificationLogs[]> {
    return this.notificationLogs;
  }

  async findById(logId: UniqueEntityID): Promise<NotificationLogs | null> {
    return (
      this.notificationLogs.find(
        (log) => log.id.toString() === logId.toString(),
      ) ?? null
    );
  }

  async findManyByNotificationId(
    notificationId: UniqueEntityID,
  ): Promise<NotificationLogs[]> {
    return this.notificationLogs.filter(
      (log) => log.notificationId.toString() === notificationId.toString(),
    );
  }

  async create(log: NotificationLogs) {
    this.notificationLogs.push(log);
  }
}
