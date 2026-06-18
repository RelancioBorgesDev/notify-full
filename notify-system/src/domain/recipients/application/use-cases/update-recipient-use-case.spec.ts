import { describe } from 'node:test';
import { InMemoryUserRepository } from '../../../../../test/repositories/in-memory-user-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '../../enterprise/entities/recipient';
import { UpdateRecipientUseCase } from './update-recipient-use-case';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient';

let recipientsRepository: InMemoryRecipientRepository;
let sut: UpdateRecipientUseCase;

describe('Update Recipients Use Case', () => {
  beforeAll(() => {
    recipientsRepository = new InMemoryRecipientRepository();
    sut = new UpdateRecipientUseCase(recipientsRepository);
  });

  it('should be able to find the user by an id', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });
    await recipientsRepository.create(recipient);

    const { recipient: updatedRecipient } = await sut.execute({
      id: recipient.id,
      name: 'Emmanuel Doe',
    });

    expect(updatedRecipient).toBeDefined();
    expect(updatedRecipient.name).not.toBe('John Doe');
    expect(updatedRecipient.name).toBe('Emmanuel Doe');
  });

  it('should throw if the user id does not exist', async () => {
    const id = new UniqueEntityID('non-existent-id');
    await expect(
      sut.execute({
        id: id,
      }),
    ).rejects.toThrow(`Recipient with id ${id} not found`);
  });

  it('should throw if the user email already exists', async () => {
    const recipient = Recipient.create({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });
    await recipientsRepository.create(recipient);

    await expect(
      sut.execute({
        id: recipient.id,
        email: 'email@test.com',
      }),
    ).rejects.toThrow(`Email already in use`);
  });
});
