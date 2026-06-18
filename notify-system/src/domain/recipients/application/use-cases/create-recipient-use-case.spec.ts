import { describe } from 'node:test';
import { CreateRecipientUseCase } from './create-recipient-use-case';
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient';

let recipientsRepository: InMemoryRecipientRepository;
let sut: CreateRecipientUseCase;

describe('Create Recipient Use Case', () => {
  beforeAll(() => {
    recipientsRepository = new InMemoryRecipientRepository();
    sut = new CreateRecipientUseCase(recipientsRepository);
  });

  it('should be able to create an recipient', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'email@test.com',
      phone: '123456789',
      pushToken: '123456789',
    });

    const foundRecipient = await recipientsRepository.findById(
      result.recipient.id,
    );
    expect(foundRecipient).toBeDefined();
    expect(result.recipient.name).toBe('John Doe');
    expect(result.recipient.email).toBe('email@test.com');
    expect(result.recipient.phone).toBe('123456789');
    expect(result.recipient.pushToken).toBe('123456789');
  });
});
