import { Template as PrismaNotificationTemplate, $Enums } from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { Channel } from '@/domain/notification/enterprise/entities/notification';

export class PrismaNotificationTemplateMapper {
  static toPrisma(notificationTemplate: NotificationTemplate) {
    return {
      id: notificationTemplate.id.toString(),
      title: notificationTemplate.title,
      channel: notificationTemplate.channel as $Enums.Channel,
      subject: notificationTemplate.subject,
      content: notificationTemplate.content,
      createdAt: notificationTemplate.createdAt,
    };
  }

  static toDomain(raw: PrismaNotificationTemplate): NotificationTemplate {
    return NotificationTemplate.create(
      {
        title: raw.name,
        channel: raw.channel as Channel,
        content: raw.body,
        createdAt: raw.createdAt,
        subject: raw.subject ?? undefined,
      },
      new UniqueEntityID(raw.id),
    );
  }
}
