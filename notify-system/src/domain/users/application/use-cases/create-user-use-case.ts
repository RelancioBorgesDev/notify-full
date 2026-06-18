import { User, UserStatus } from '../../enterprise/entities/user';
import { HashGenerator } from '@/core/cryptography/hash-generator';
import { UserRepository } from '../repositories/user-repository';
import { ConflictException, Injectable } from '@nestjs/common';

interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  status?: UserStatus;
}

interface CreateUserResponse {
  user: User;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    email,
    name,
    password,
    status,
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      email,
      name,
      passwordHash: hashedPassword,
      status,
    });

    await this.userRepository.create(user);

    return { user };
  }
}
