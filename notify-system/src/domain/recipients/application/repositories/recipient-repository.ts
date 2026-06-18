import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '../../enterprise/entities/recipient';

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
  abstract findById(id: UniqueEntityID): Promise<Recipient | null>;
  abstract findAll(): Promise<Recipient[]>;
  abstract delete(id: UniqueEntityID): Promise<void>;
  abstract save(recipient: Recipient): Promise<void>;
}
