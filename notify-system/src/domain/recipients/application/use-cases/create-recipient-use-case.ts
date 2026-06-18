import { HashGenerator } from '@/core/cryptography/hash-generator';
import { ConflictException, Injectable } from '@nestjs/common';
import { Recipient } from '../../enterprise/entities/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

interface CreateRecipientRequest {
  name: string;
  email: string;
  phone?: string;
  pushToken?: string;
  status?: UserStatus;
}

interface CreateRecipientResponse {
  recipient: Recipient;
}

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientepository: RecipientRepository) {}

  async execute({
    name,
    email,
    phone,
    pushToken,
    status,
  }: CreateRecipientRequest): Promise<CreateRecipientResponse> {
    const recipientWithSameEmail = await this.recipientepository.findByEmail(email);

    if (recipientWithSameEmail) {
      throw new ConflictException('Recipient already exists');
    }

    const recipient = Recipient.create({
      name,
      phone,
      pushToken,
      email,
      status,
    });

    await this.recipientepository.create(recipient);

    return { recipient };
  }
}
