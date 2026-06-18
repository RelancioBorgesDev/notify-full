import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';
import { UserRepository } from '@/domain/users/application/repositories/user-repository';
import { User } from '@/domain/users/enterprise/entities/user';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async create(user: User): Promise<void> {
    this.users.push(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async findById(id: UniqueEntityID): Promise<User | null> {
    return this.users.find((user) => user.id.equals(id)) ?? null;
  }
}
