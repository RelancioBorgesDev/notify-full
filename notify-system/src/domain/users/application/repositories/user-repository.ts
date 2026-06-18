import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { User } from '../../enterprise/entities/user';

export abstract class UserRepository {
  abstract create(user: User): Promise<void>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(id: UniqueEntityID ): Promise<User | null>;
}
