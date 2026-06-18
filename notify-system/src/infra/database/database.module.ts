import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma-service';
import { UserRepository } from '../../domain/users/application/repositories/user-repository';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { PrismaUserRepository } from './prisma/repository/prisma-user-repository';
import { PrismaNotificationsRepository } from './prisma/repository/prisma-notification-repository';
import { NotificationLogsRepository } from '@/domain/notification/application/repositories/notification-logs-repository';
import { PrismaNotificationLogsRepository } from './prisma/repository/prisma-notification-logs-repository';
import { NotificationTemplateRepository } from '@/domain/notification/application/repositories/notification-template-repository';
import { PrismaNotificationTemplateRepository } from './prisma/repository/prisma-notification-template-repository';
import { RecipientRepository } from '@/domain/recipients/application/repositories/recipient-repository';
import { PrismaRecipientRepository } from './prisma/repository/prisma-recipient-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: NotificationLogsRepository,
      useClass: PrismaNotificationLogsRepository,
    },
    {
      provide: NotificationTemplateRepository,
      useClass: PrismaNotificationTemplateRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
  ],

  exports: [
    PrismaService,
    UserRepository,
    NotificationsRepository,
    NotificationLogsRepository,
    NotificationTemplateRepository,
    RecipientRepository,
  ],
})
export class DatabaseModule {}
