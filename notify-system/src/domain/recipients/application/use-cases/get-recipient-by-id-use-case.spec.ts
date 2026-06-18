import { describe } from 'node:test';
import { GetRecipientByIdUseCase } from './get-recipient-by-id-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '../../enterprise/entities/recipient';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient';

let recipientsRepository: InMemoryRecipientRepository;
let sut: GetRecipientByIdUseCase;

describe('Get Recipient By Id Use Case', () => {
  beforeAll(() => {
    recipientsRepository = new InMemoryRecipientRepository();
    sut = new GetRecipientByIdUseCase(recipientsRepository);
  });

  it('should be able to find the user by an id', async () => {
    const newRecipient = Recipient.create({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });
    await recipientsRepository.create(newRecipient);

    const { recipient } = await sut.execute({
      id: newRecipient.id,
    });

    expect(recipient).toBeDefined();
    expect(recipient.email).toBe('email@test.com');
    expect(recipient.id.equals(newRecipient.id)).toBe(true);
  });

  it('should throw if the user id does not exist', async () => {
    await expect(
      sut.execute({
        id: new UniqueEntityID('non-existent-id'),
      }),
    ).rejects.toThrow('Recipient not found');
  });
});
