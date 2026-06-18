import { NotificationTemplate } from '../../enterprise/entities/notification-template';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export abstract class NotificationTemplateRepository {
  abstract findById(
    templateId: UniqueEntityID,
  ): Promise<NotificationTemplate | null>;
  
  abstract create(template: NotificationTemplate): Promise<void>;
  abstract save(template: NotificationTemplate): Promise<void>;
  abstract delete(templateId: UniqueEntityID): Promise<void>;
  abstract list(): Promise<NotificationTemplate[]>;
}
