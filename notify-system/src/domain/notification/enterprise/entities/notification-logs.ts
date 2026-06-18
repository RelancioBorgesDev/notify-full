import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export enum LogStatus {
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
}

export interface NotificationLogsProps {
  notificationId: UniqueEntityID;
  status: LogStatus;
  response?: string;
  errorMessage?: string | null;
  attempt: number;
  sentAt: Date;
}

export class NotificationLogs extends Entity<NotificationLogsProps> {
  get notificationId() {
    return this.props.notificationId;
  }

  get status() {
    return this.props.status;
  }

  get response() {
    return this.props.response;
  }

  get errorMessage() {
    return this.props.errorMessage;
  }

  get attempt() {
    return this.props.attempt;
  }

  get sentAt() {
    return this.props.sentAt;
  }

  static create(
    props: Optional<NotificationLogsProps, 'sentAt'>,
    id?: UniqueEntityID,
  ) {
    return new NotificationLogs(
      {
        ...props,
        sentAt: props.sentAt ?? new Date(),
      },
      id,
    );
  }
}
