import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';
import { Channel } from './notification';

export interface NotificationTemplateProps {
  title: string;
  channel: Channel;
  subject?: string;
  content: string;
  createdAt: Date;
}

export class NotificationTemplate extends Entity<NotificationTemplateProps> {
  get title() {
    return this.props.title;
  }

  get channel() {
    return this.props.channel;
  }

  get subject() {
    return this.props.subject;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  update(updates: {
    title?: string;
    channel?: Channel;
    subject?: string;
    content?: string;
  }) {
    if (updates.title !== undefined) {
      this.props.title = updates.title;
    }

    if (updates.channel !== undefined) {
      this.props.channel = updates.channel;
    }

    if (updates.subject !== undefined) {
      this.props.subject = updates.subject;
    }

    if (updates.content !== undefined) {
      this.props.content = updates.content;
    }
  }

  static create(
    props: Optional<NotificationTemplateProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const template = new NotificationTemplate(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return template;
  }
}
