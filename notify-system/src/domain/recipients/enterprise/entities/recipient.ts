import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

export interface RecipientProps {
  id: UniqueEntityID;
  name: string;
  email: string;
  phone?: string;
  pushToken?: string;
  status?: UserStatus;
  createdAt: Date;
}

export class Recipient extends Entity<RecipientProps> {
  get id(): UniqueEntityID {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string | null {
    return this.props.phone ?? null;
  }

  get pushToken(): string | null {
    return this.props.pushToken ?? null;
  }

  get status(): UserStatus {
    return this.props.status ?? UserStatus.ACTIVE;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  update(updates: {
    name?: string;
    email?: string;
    phone?: string;
    pushToken?: string;
    status?: UserStatus;
  }) {
    if (updates.name !== undefined) this.props.name = updates.name;
    if (updates.email !== undefined) this.props.email = updates.email;
    if (updates.phone !== undefined) this.props.phone = updates.phone;
    if (updates.pushToken !== undefined)
      this.props.pushToken = updates.pushToken;
    if (updates.status !== undefined) this.props.status = updates.status;
  }

  static create(
    props: Omit<RecipientProps, 'id' | 'createdAt'>,
    id?: UniqueEntityID,
  ): Recipient {
    return new Recipient({
      id: id ?? new UniqueEntityID(),
      createdAt: new Date(),
      ...props,
    });
  }
}
