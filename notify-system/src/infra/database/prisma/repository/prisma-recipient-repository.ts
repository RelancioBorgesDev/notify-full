import { UserRepository } from '@/domain/users/application/repositories/user-repository';
import { User } from '@/domain/users/enterprise/entities/user';
import { PrismaService } from '../prisma-service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RecipientRepository } from '@/domain/recipients/application/repositories/recipient-repository';
import { Recipient } from '@/domain/recipients/enterprise/entities/recipient';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.create({
      data,
    });
  }
  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }
  async findById(id: UniqueEntityID): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }
  async findAll(): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany();

    return recipients.map(PrismaRecipientMapper.toDomain);
  }
  async delete(id: UniqueEntityID): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id: id.toString(),
      },
    });
  }
  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);

    await this.prisma.recipient.update({
      where: {
        id: recipient.id.toString(),
      },
      data,
    });
  }
}
