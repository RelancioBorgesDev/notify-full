import { Injectable } from '@nestjs/common';
import { NotificationTemplateRepository } from '../../repositories/notification-template-repository';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';

interface CreateNotificationTemplateRequest {
  title: string;
  channel: Channel;
  subject?: string;
  content: string;
}

interface CreateNotificationTemplateResponse {
  template: NotificationTemplate;
}

@Injectable()
export class CreateNotificationTemplateUseCase {
  constructor(
    private notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  async execute({
    title,
    channel,
    subject,
    content,
  }: CreateNotificationTemplateRequest): Promise<CreateNotificationTemplateResponse> {
    const template = NotificationTemplate.create({
      title,
      content,
      channel,
      subject,
    });

    await this.notificationTemplateRepository.create(template);

    return { template };
  }
}
