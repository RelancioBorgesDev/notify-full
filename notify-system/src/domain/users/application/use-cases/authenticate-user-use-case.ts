import { HashComparer } from '@/core/cryptography/hash-comparer';
import { User } from '../../enterprise/entities/user';
import { UserRepository } from '../repositories/user-repository';
import { Encrypter } from '@/core/cryptography/encrypter';
import { Injectable, NotFoundException } from '@nestjs/common';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

interface AuthenticateUserResponse {
  accessToken: string;
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}
  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new Error('Credentials do not match');
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    });

    return { accessToken };
  }
}
