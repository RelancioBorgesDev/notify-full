import { UserRepository } from '@/domain/users/application/repositories/user-repository';
import { User } from '@/domain/users/enterprise/entities/user';
import { PrismaService } from '../prisma-service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user);

    await this.prisma.user.create({
      data,
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }
  async findById(id: UniqueEntityID): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!user) {
      return null;
    }
    return PrismaUserMapper.toDomain(user);
  }
}
