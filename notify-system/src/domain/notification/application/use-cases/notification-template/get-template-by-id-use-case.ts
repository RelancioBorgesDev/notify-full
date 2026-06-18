import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationTemplateRepository } from '../../repositories/notification-template-repository';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface GetNotificationTemplateByIdRequest {
  templateId: UniqueEntityID | null;
}

interface GetNotificationTemplateByIdResponse {
  template: NotificationTemplate;
}

@Injectable()
export class GetNotificationTemplateByIdUseCase {
  constructor(
    private notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  async execute({
    templateId,
  }: GetNotificationTemplateByIdRequest): Promise<GetNotificationTemplateByIdResponse> {
    if (!templateId) {
      throw new Error('TemplateId is required');
    }

    const template =
      await this.notificationTemplateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return { template };
  }
}
