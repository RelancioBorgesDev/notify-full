import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  Channel,
  Notification,
  NotificationStatus,
} from '../../enterprise/entities/notification';
import { NotificationContent } from '../../enterprise/value-object/notification-content';

export interface SaveNotificationUseCaseRequest {
  id: UniqueEntityID;
  updates: {
    title?: string;
    content?: NotificationContent;
    templateId?: UniqueEntityID;
    channel?: Channel;
    status?: NotificationStatus;
    priority?: number;
    retries?: number;
    error?: string;
    readAt?: Date | null;
    scheduledAt?: Date | null;
  };
}

@Injectable()
export class SaveNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({ id, updates }: SaveNotificationUseCaseRequest): Promise<void> {
    const notification = await this.notificationRepository.findById(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.update(updates);
    await this.notificationRepository.save(notification);
  }
}
