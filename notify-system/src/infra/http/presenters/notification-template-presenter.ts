import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';

export class NotificationTemplatePresenter {
  static toHTTP(template: NotificationTemplate) {
    return {
      id: template.id.toString(),
      title: template.title,
      content: template.content,
      channel: template.channel,
      subject: template.subject,
      createdAt: template.createdAt.toISOString(),
    };
  }
}
