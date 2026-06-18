import {
  User as PrismaUser,
  Prisma,
  UserStatus as PrismaUserStatus,
} from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { User, UserStatus } from '@/domain/users/enterprise/entities/user';

export class PrismaUserMapper {
  private static convertPrismaStatusToDomain(
    prismaStatus: PrismaUserStatus,
  ): UserStatus {
    return prismaStatus === PrismaUserStatus.ACTIVE
      ? UserStatus.ACTIVE
      : UserStatus.INACTIVE;
  }

  private static convertDomainStatusToPrisma(
    domainStatus: UserStatus,
  ): PrismaUserStatus {
    return domainStatus === UserStatus.ACTIVE
      ? PrismaUserStatus.ACTIVE
      : PrismaUserStatus.INACTIVE;
  }

  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        email: raw.email,
        name: raw.name,
        passwordHash: raw.password,
        status: PrismaUserMapper.convertPrismaStatusToDomain(raw.status),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.passwordHash,
      status: PrismaUserMapper.convertDomainStatusToPrisma(
        user.status ?? UserStatus.ACTIVE,
      ),
    };
  }
}
