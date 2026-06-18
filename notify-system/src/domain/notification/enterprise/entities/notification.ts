import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { NotificationContent } from '../value-object/notification-content';

export enum Channel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  READ = 'READ',
}

export interface NotificationProps {
  recipientId: UniqueEntityID;
  senderId?: UniqueEntityID | null;
  templateId?: UniqueEntityID | null;
  channel: Channel;
  title: string;
  content: NotificationContent;
  status: NotificationStatus;
  priority: number;
  retries: number;
  error?: string;
  readAt?: Date | null;
  scheduledAt?: Date | null;
  recipientData?: {
    id?: string;
    email?: string;
  };
  createdAt: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId() {
    return this.props.recipientId;
  }

  get recipientData() {
    return this.props.recipientData;
  }

  get title() {
    return this.props.title;
  }

  get content() {
    return this.props.content.value;
  }

  get readAt() {
    return this.props.readAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  get status() {
    return this.props.status;
  }
  get priority() {
    return this.props.priority;
  }

  get channel() {
    return this.props.channel;
  }

  get senderId() {
    return this.props.senderId;
  }

  get templateId() {
    return this.props.templateId;
  }

  get retries() {
    return this.props.retries;
  }

  get error() {
    return this.props.error;
  }

  get scheduledAt() {
    return this.props.scheduledAt;
  }

  read() {
    this.props.readAt = new Date();
  }

  updateTitle(title: string): void {
    this.props.title = title;
  }

  updateContent(content: NotificationContent): void {
    this.props.content = content;
  }

  update(updates: {
    title?: string;
    content?: NotificationContent;
    templateId?: UniqueEntityID;
    channel?: Channel;
    status?: NotificationStatus;
    priority?: number;
    retries?: number;
    error?: string;
    readAt?: Date | null;
    scheduledAt?: Date | null;
  }) {
    if (updates.title !== undefined) this.props.title = updates.title;
    if (updates.content !== undefined) this.props.content = updates.content;
    if (updates.templateId !== undefined)
      this.props.templateId = updates.templateId;
    if (updates.channel !== undefined) this.props.channel = updates.channel;
    if (updates.status !== undefined) this.props.status = updates.status;
    if (updates.priority !== undefined) this.props.priority = updates.priority;
    if (updates.retries !== undefined) this.props.retries = updates.retries;
    if (updates.error !== undefined) this.props.error = updates.error;
    if (updates.readAt !== undefined) this.props.readAt = updates.readAt;
    if (updates.scheduledAt !== undefined)
      this.props.scheduledAt = updates.scheduledAt;
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return notification;
  }
}
