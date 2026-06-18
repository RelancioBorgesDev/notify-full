import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface UserProps {
  id: UniqueEntityID;
  name: string;
  email: string;
  passwordHash: string;
  status?: UserStatus;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  get id(): UniqueEntityID {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get status(): UserStatus | null {
    return this.props.status ?? null;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  static create(
    props: Omit<UserProps, 'id' | 'createdAt'>,
    id?: UniqueEntityID,
  ): User {
    return new User({
      id: id ?? new UniqueEntityID(),
      createdAt: new Date(),
      ...props,
    });
  }
}
