import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

interface UpdateRecipientRequest {
  id: UniqueEntityID;
  name?: string;
  email?: string;
  phone?: string;
  pushToken?: string;
  status?: UserStatus;
}

interface UpdateRecipientUseCaseResponse {
  recipient: Recipient;
}

@Injectable()
export class UpdateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    id,
    name,
    email,
    phone,
    pushToken,
    status,
  }: UpdateRecipientRequest): Promise<UpdateRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(id);

    if (!recipient) {
      throw new NotFoundException(`Recipient with id ${id} not found`);
    }

    if (email) {
      const recipientWithSameEmail =
        await this.recipientRepository.findByEmail(email);

      if (
        recipientWithSameEmail &&
        recipientWithSameEmail.id.toString() !== recipient.id.toString()
      ) {
        throw new ConflictException('Email already in use');
      }
    }

    recipient.update({ name, email, phone, pushToken, status });
    await this.recipientRepository.save(recipient);

    return { recipient };
  }
}
