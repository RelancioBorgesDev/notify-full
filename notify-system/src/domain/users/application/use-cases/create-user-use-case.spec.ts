import { describe } from 'node:test';
import { InMemoryUserRepository } from '../../../../../test/repositories/in-memory-user-repository';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { CreateUserUseCase } from './create-user-use-case';

let usersRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let sut: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHasher();
    sut = new CreateUserUseCase(usersRepository, fakeHasher);
  });

  it('should be able to create an user', async () => {
    const result = await sut.execute({
      email: 'email@test.com',
      name: 'John Doe',
      password: '123456',
    });

    const foundUser = await usersRepository.findById(result.user.id);
    expect(foundUser).toBeDefined();
    expect(result.user.email).toBe('email@test.com');
    expect(result.user.passwordHash).toEqual(foundUser?.passwordHash);
  });
});
