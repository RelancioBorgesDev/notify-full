import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RecipientRepository } from '@/domain/recipients/application/repositories/recipient-repository';
import { Recipient } from '@/domain/recipients/enterprise/entities/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
  private recipients: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.recipients.push(recipient);
  }
  async findByEmail(email: string): Promise<Recipient | null> {
    return (
      this.recipients.find((recipient) => recipient.email === email) ?? null
    );
  }
  async findById(id: UniqueEntityID): Promise<Recipient | null> {
    return this.recipients.find((recipient) => recipient.id.equals(id)) ?? null;
  }
  async findAll(): Promise<Recipient[]> {
    return this.recipients;
  }
  async delete(id: UniqueEntityID): Promise<void> {
    this.recipients = this.recipients.filter(
      (recipient) => !recipient.id.equals(id),
    );
  }
  async save(recipient: Recipient): Promise<void> {
    const recipientIndex = this.recipients.findIndex((recipient) =>
      recipient.id.equals(recipient.id),
    );
    this.recipients[recipientIndex] = recipient;
  }
}
