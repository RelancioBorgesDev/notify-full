import { Injectable, NotFoundException } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationTemplateRepository } from '../../repositories/notification-template-repository';

interface DeleteNotificationUseCaseRequest {
  templateId: UniqueEntityID;
}

@Injectable()
export class DeleteNotificationTemplateUseCase {
  constructor(
    private notificationTemplateRepository: NotificationTemplateRepository,
  ) {}

  async execute({ templateId }: DeleteNotificationUseCaseRequest) {
    const template =
      await this.notificationTemplateRepository.findById(templateId);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    await this.notificationTemplateRepository.delete(templateId);
  }
}
