import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async listAll(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      include: {
        recipient: {
          select: {
            email: true,
          },
        },
      },
    });
    return notifications.map(PrismaNotificationMapper.toDomain);
  }

  async findManyByRecipientId(
    recipientId: UniqueEntityID,
  ): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        recipientId: recipientId.toString(),
      },
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }

  async findScheduledNotifications(now: Date): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        scheduledAt: {
          lte: now,
        },
      },
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }

  async delete(notificationId: UniqueEntityID): Promise<void> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId.toString(),
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: {
        id: notificationId.toString(),
      },
    });
  }

  async findById(id: UniqueEntityID) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: id.toString() },
      include: {
        recipient: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!notification) return null;

    return PrismaNotificationMapper.toDomain(notification);
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);
    await this.prisma.notification.create({ data });
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);
    await this.prisma.notification.update({
      where: { id: data.id },
      data,
    });
  }
}
