import { Injectable, NotFoundException } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';

interface GetRecipientByIdUseCaseRequest {
  id: UniqueEntityID;
}

interface GetRecipientByIdUseCaseResponse {
  recipient: Recipient;
}

@Injectable()
export class GetRecipientByIdUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    id,
  }: GetRecipientByIdUseCaseRequest): Promise<GetRecipientByIdUseCaseResponse> {
    const foundRecipient = await this.recipientRepository.findById(id);

    if (!foundRecipient) {
      throw new NotFoundException('Recipient not found');
    }

    return { recipient: foundRecipient };
  }
}
