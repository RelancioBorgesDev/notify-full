import { User } from '../../enterprise/entities/user';
import { UserRepository } from '../repositories/user-repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface GetUserByIdUseCaseRequest {
  id: UniqueEntityID;
}

interface GetUserByIdUseCaseResponse {
  user: User;
}

@Injectable()
export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    id,
  }: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return { user: foundUser };
  }
}
