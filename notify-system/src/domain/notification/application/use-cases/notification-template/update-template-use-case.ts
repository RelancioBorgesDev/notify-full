import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationTemplateRepository } from '../../repositories/notification-template-repository';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface UpdateNotificationTemplateRequest {
  templateId: UniqueEntityID;
  title?: string;
  channel?: Channel;
  subject?: string | null;
  content?: string;
}

interface UpdateNotificationTemplateResponse {
  template: NotificationTemplate;
}

@Injectable()
export class UpdateNotificationTemplateUseCase {
  constructor(
    private notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  async execute({
    templateId,
    title,
    channel,
    subject,
    content,
  }: UpdateNotificationTemplateRequest): Promise<UpdateNotificationTemplateResponse> {
    const template =
      await this.notificationTemplateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    template.update({
      title,
      channel,
      subject: subject ?? undefined,
      content,
    });

    await this.notificationTemplateRepository.save(template);

    return { template };
  }
}
