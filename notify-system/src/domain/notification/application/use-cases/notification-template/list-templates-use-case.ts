import { Injectable } from '@nestjs/common';
import { NotificationTemplateRepository } from '../../repositories/notification-template-repository';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';

interface ListNotificationTemplatesResponse {
  templates: NotificationTemplate[];
}

@Injectable()
export class ListNotificationTemplatesUseCase {
  constructor(
    private notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  async execute(): Promise<ListNotificationTemplatesResponse> {
    const templates = await this.notificationTemplateRepository.list();

    if (!templates) {
      throw new Error('Templates not found');
    }

    return { templates };
  }
}
