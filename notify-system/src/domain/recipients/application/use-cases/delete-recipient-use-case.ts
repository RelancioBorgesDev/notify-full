import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipientRepository } from '../repositories/recipient-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface DeleteRecipientRequest {
  id: UniqueEntityID;
}

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}
  async execute({ id }: DeleteRecipientRequest) {
    const recipient = await this.recipientRepository.findById(id);

    if (!recipient) {
      throw new NotFoundException('Recipient not found');
    }

    await this.recipientRepository.delete(recipient.id);
  }
}
