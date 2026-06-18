import { describe } from 'node:test';
import { User } from '../../enterprise/entities/user';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';
import { InMemoryUserRepository } from '../../../../../test/repositories/in-memory-user-repository';
import { FakeHasher } from '../../../../../test/cryptography/fake-hasher';
import { FakeEncrypter } from '../../../../../test/cryptography/fake-encrypter';

let usersRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;
let sut: AuthenticateUserUseCase;

describe('Authenticate User Use Case', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUserRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();
    sut = new AuthenticateUserUseCase(usersRepository, fakeHasher, encrypter);
  });

  it('should be able to authenticate the user', async () => {
    const user = User.create({
      email: 'email@test.com',
      name: 'John Doe',
      passwordHash: await fakeHasher.hash('123456'),
    });

    await usersRepository.create(user);

    const result = await sut.execute({
      email: user.email,
      password: '123456',
    });

    expect(result).toEqual({
      accessToken: expect.any(String),
    });
  });
});
