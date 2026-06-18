import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-service';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationTemplateRepository } from '@/domain/notification/application/repositories/notification-template-repository';
import { NotificationTemplate } from '@/domain/notification/enterprise/entities/notification-template';
import { PrismaNotificationTemplateMapper } from '../mappers/prisma-notification-template-mapper';

@Injectable()
export class PrismaNotificationTemplateRepository
  implements NotificationTemplateRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(templateId: UniqueEntityID) {
    const template = await this.prisma.template.findUnique({
      where: {
        id: templateId.toString(),
      },
    });

    if (!template) {
      throw new NotFoundException('Template was not found');
    }

    return PrismaNotificationTemplateMapper.toDomain(template);
  }
  
  async create(template: NotificationTemplate): Promise<void> {
    const { id, channel, content, createdAt, subject, title } = template;
    await this.prisma.template.create({
      data: {
        id: id.toString(),
        body: content,
        name: title,
        channel,
        createdAt,
        subject,
      },
    });
  }

  async save(template: NotificationTemplate): Promise<void> {
    const { id, channel, content, createdAt, subject, title } = template;

    await this.prisma.template.update({
      where: {
        id: id.toString(),
      },
      data: {
        body: content,
        name: title,
        channel,
        createdAt,
        subject,
      },
    });
  }

  async delete(templateId: UniqueEntityID): Promise<void> {
    await this.prisma.template.delete({
      where: {
        id: templateId.toString(),
      },
    });
  }

  async list(): Promise<NotificationTemplate[]> {
    const templates = await this.prisma.template.findMany();

    return templates.map(PrismaNotificationTemplateMapper.toDomain);
  }
}
