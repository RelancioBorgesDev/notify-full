import { describe } from 'node:test';
import { InMemoryUserRepository } from '../../../../../test/repositories/in-memory-user-repository';
import { GetUserByIdUseCase } from './get-user-by-id-use-case';
import { User } from '../../enterprise/entities/user';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

let usersRepository: InMemoryUserRepository;
let sut: GetUserByIdUseCase;

describe('Get User By Id Use Case', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new GetUserByIdUseCase(usersRepository);
  });

  it('should be able to find the user by an id', async () => {
    const newUser = User.create({
      email: 'email@test.com',
      name: 'John Doe',
      passwordHash: '123456',
    });
    await usersRepository.create(newUser);

    const { user } = await sut.execute({
      id: newUser.id,
    });

    expect(user).toBeDefined();
    expect(user.email).toBe('email@test.com');
    expect(user.id.equals(newUser.id)).toBe(true);
  });

  it('should throw if the user id does not exist', async () => {
    await expect(
      sut.execute({
        id: new UniqueEntityID('non-existent-id'),
      }),
    ).rejects.toThrow('User not found');
  });
});
