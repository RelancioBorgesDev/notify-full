import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationTemplateRepository } from '@/domain/notification/application/repositories/notification-template-repository';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';

export class InMemoryNotificationTemplateRepository
  implements NotificationTemplateRepository
{
  private notificationTemplates: NotificationTemplate[] = [];

  async findById(
    templateId: UniqueEntityID,
  ): Promise<NotificationTemplate | null> {
    return (
      this.notificationTemplates.find((template) =>
        template.id.equals(templateId),
      ) ?? null
    );
  }

  async create(template: NotificationTemplate): Promise<void> {
    this.notificationTemplates.push(template);
  }

  async save(template: NotificationTemplate): Promise<void> {
    const index = this.notificationTemplates.findIndex((t) =>
      t.id.equals(template.id),
    );

    if (index !== -1) {
      this.notificationTemplates[index] = template;
    } else {
      this.notificationTemplates.push(template);
    }
  }

  async delete(templateId: UniqueEntityID): Promise<void> {
    this.notificationTemplates = this.notificationTemplates.filter(
      (template) => !template.id.equals(templateId),
    );
  }

  async list(): Promise<NotificationTemplate[]> {
    // Clonar para evitar mutações externas
    return [...this.notificationTemplates];
  }
}
