import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface DeleteNotificationUseCaseRequest {
  notificationId: UniqueEntityID;
}

@Injectable()
export class DeleteNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({ notificationId }: DeleteNotificationUseCaseRequest) {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.notificationsRepository.delete(notificationId);
  }
}
