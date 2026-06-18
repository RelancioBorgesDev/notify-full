import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Notification } from '../../enterprise/entities/notification';
interface CreateNotificationResponse {
  notifications: Notification[];
}

@Injectable()
export class ListAllNotificationsUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(): Promise<CreateNotificationResponse> {
    const notifications = await this.notificationRepository.listAll();

    return { notifications: notifications };
  }
}
