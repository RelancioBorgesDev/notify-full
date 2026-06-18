import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationLog } from '@prisma/client';
import { NotificationLogsRepository } from '@/domain/notification/application/repositories/notification-logs-repository';
import { NotificationLogs } from '@/domain/notification/enterprise/entities/notification-logs';
import { PrismaNotificationLogsMapper } from '../mappers/prisma-notification-logs-mapper';

@Injectable()
export class PrismaNotificationLogsRepository
  implements NotificationLogsRepository
{
  constructor(private prisma: PrismaService) {}

  async delete(logId: UniqueEntityID): Promise<void> {
    await this.prisma.notificationLog.delete({
      where: {
        id: logId.toString(),
      },
    });
  }
  async deleteManyByNotificationId(
    notificationId: UniqueEntityID,
  ): Promise<void> {
    await this.prisma.notificationLog.deleteMany({
      where: {
        notificationId: notificationId.toString(),
      },
    });
  }
  async listAll(): Promise<NotificationLogs[]> {
    const notificationLogs = await this.prisma.notificationLog.findMany();
    return notificationLogs.map((notificationLog) =>
      PrismaNotificationLogsMapper.toDomain(notificationLog),
    );
  }

  async findById(logId: UniqueEntityID) {
    const notificationLog = await this.prisma.notificationLog.findUnique({
      where: {
        id: logId.toString(),
      },
    });

    if (!notificationLog) {
      throw new NotFoundException('Log was not found !');
    }

    return PrismaNotificationLogsMapper.toDomain(notificationLog);
  }

  async findManyByNotificationId(notificationId: UniqueEntityID) {
    const notificationLogs = await this.prisma.notificationLog.findMany({
      where: {
        notificationId: notificationId.toString(),
      },
    });
    if (!notificationLogs) {
      throw new NotFoundException('Logs was not found !');
    }

    return notificationLogs.map((notificationLog) =>
      PrismaNotificationLogsMapper.toDomain(notificationLog),
    );
  }

  async create(log: NotificationLogs): Promise<void> {
    const { notificationId, attempt, errorMessage, response, sentAt, status } =
      log;
    await this.prisma.notificationLog.create({
      data: {
        notificationId: notificationId.toString(),
        attempt,
        errorMessage,
        response,
        sentAt,
        status,
      },
    });
  }
}
