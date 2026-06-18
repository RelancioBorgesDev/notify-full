import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationLogsRepository } from '../../repositories/notification-logs-repository';
import { NotificationLogs } from '@/domain/notification/enterprise/entities/notification-logs';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '../../repositories/notifications-repository';

interface GetNotificationLogsUseCaseRequest {
  notificationId: UniqueEntityID;
}

interface GetNotificationLogsUseCaseResponse {
  notificationLogs: NotificationLogs[];
}

@Injectable()
export class GetNotificationLogsUseCaseUseCase {
  constructor(
    private notificationLogsRepository: NotificationLogsRepository,
    private notificationRepository: NotificationsRepository,
  ) {}

  async execute({
    notificationId,
  }: GetNotificationLogsUseCaseRequest): Promise<GetNotificationLogsUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const notificationLogs =
      await this.notificationLogsRepository.findManyByNotificationId(
        notificationId,
      );

    return { notificationLogs };
  }
}
