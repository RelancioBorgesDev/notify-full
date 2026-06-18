import { describe } from 'node:test';
import { InMemoryUserRepository } from '../../../../../test/repositories/in-memory-user-repository';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';
import { DeleteRecipientUseCase } from './delete-recipient-use-case';
import { Recipient } from '../../enterprise/entities/recipient';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient';

let recipientRepository: InMemoryRecipientRepository;
let sut: DeleteRecipientUseCase;

describe('Delete Recipient Use Case', () => {
  beforeAll(() => {
    recipientRepository = new InMemoryRecipientRepository();
    sut = new DeleteRecipientUseCase(recipientRepository);
  });

  it('should be able to delete the recipient', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });

    await recipientRepository.create(recipient);

    await sut.execute({
      id: recipient.id,
    });
    const recipientDeleted = await recipientRepository.findById(recipient.id);

    expect(recipientDeleted).toBeNull();
  });
});
