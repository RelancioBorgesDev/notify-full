import {
  Recipient as PrismaRecipient,
  Prisma,
  UserStatus as PrismaUserStatus,
} from '@prisma/client';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Recipient } from '@/domain/recipients/enterprise/entities/recipient';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

export class PrismaRecipientMapper {
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

  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        email: raw.email,
        phone: raw.phone ?? undefined,
        pushToken: raw.pushToken ?? undefined,
        status: PrismaRecipientMapper.convertPrismaStatusToDomain(raw.status),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      phone: recipient.phone,
      pushToken: recipient.pushToken,
      status: PrismaRecipientMapper.convertDomainStatusToPrisma(
        recipient.status,
      ),
    };
  }
}
