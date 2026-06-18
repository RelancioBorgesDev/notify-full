import { describe } from 'node:test';
import { Recipient } from '../../enterprise/entities/recipient';
import { ListAllRecipientsUseCase } from './list-all-recipients';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient';

let recipientsRepository: InMemoryRecipientRepository;
let sut: ListAllRecipientsUseCase;

describe('List All Recipients Use Case', () => {
  beforeAll(() => {
    recipientsRepository = new InMemoryRecipientRepository();
    sut = new ListAllRecipientsUseCase(recipientsRepository);
  });

  it('should be able to list all recipients', async () => {
    const recipient1 = Recipient.create({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });
    const recipient2 = Recipient.create({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });

    await recipientsRepository.create(recipient1);
    await recipientsRepository.create(recipient2);

    const { recipients } = await sut.execute();

    expect(recipients).toEqual([recipient1, recipient2]);
    expect(recipients).toHaveLength(2);
  });
});
