import { Injectable } from '@nestjs/common';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';

interface ListRecipientsUseCaseResponse {
  recipients: Recipient[];
}

@Injectable()
export class ListAllRecipientsUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute(): Promise<ListRecipientsUseCaseResponse> {
    const recipients = await this.recipientRepository.findAll();

    return { recipients: recipients };
  }
}
