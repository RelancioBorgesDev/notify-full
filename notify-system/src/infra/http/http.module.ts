import { Module } from '@nestjs/common';
import { AuthenticateUserController } from './controllers/user/authenticate-user-controller';
import { CreateUserController } from './controllers/user/create-user-controller';
import { DatabaseModule } from '../database/database.module';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user-use-case';
import { CreateNotificationController } from './controllers/notification/create-notification-controller';
import { DeleteNotificationController } from './controllers/notification/delete-notification-controller';
import { SaveNotificationController } from './controllers/notification/save-notification-controller';
import { GetNotificationLogsController } from './controllers/notification-logs/get-notification-logs-controller';
import { LogNotificationAttemptController } from './controllers/notification-logs/log-notification-attempt-controller';
import { CreateNotificationTemplateController } from './controllers/notification-template/create-notification-template-controller';
import { GetTemplateByIdController } from './controllers/notification-template/get-template-by-id-controller';
import { ListTemplatesController } from './controllers/notification-template/list-templates-controller';
import { UpdateNotificationController } from './controllers/notification-template/update-notification-template';
import { NotificationDomainModule } from '@/domain/notification/notification-domain.module';
import { UserRepository } from '@/domain/users/application/repositories/user-repository';
import { PrismaUserRepository } from '../database/prisma/repository/prisma-user-repository';
import { GetProfileController } from './controllers/user/me-controller';
import { ListAllNotificationsController } from './controllers/notification/list-all-notifications-controller';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id-use-case';
import { GetUserByIdController } from './controllers/user/get-user-by-id-controller';
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user-use-case';
import { CreateRecipientController } from './controllers/recipient/create-recipient-controller';
import { GetRecipientByIdController } from './controllers/recipient/get-recipient-by-id-controller';
import { UpdateRecipientController } from './controllers/recipient/update-recipient-controller';
import { ListAllRecipientsController } from './controllers/recipient/list-all-recipient-controller';
import { DeleteRecipientController } from './controllers/recipient/delete-recipient-controller';
import { DeleteNotificationUseCase } from '@/domain/notification/application/use-cases/delete-notification-use-case';
import { SaveNotificationUseCase } from '@/domain/notification/application/use-cases/save-notification-use-case';
import { GetNotificationLogsUseCaseUseCase } from '@/domain/notification/application/use-cases/notification-logs/get-notification-logs-use-case';
import { LogNotificationAttemptUseCase } from '@/domain/notification/application/use-cases/notification-logs/log-notification-attempt-use-case';
import { CreateNotificationTemplateUseCase } from '@/domain/notification/application/use-cases/notification-template/create-template-use-case';
import { ListNotificationTemplatesUseCase } from '@/domain/notification/application/use-cases/notification-template/list-templates-use-case';
import { GetNotificationTemplateByIdUseCase } from '@/domain/notification/application/use-cases/notification-template/get-template-by-id-use-case';
import { UpdateNotificationTemplateUseCase } from '@/domain/notification/application/use-cases/notification-template/update-template-use-case';
import { CreateRecipientUseCase } from '@/domain/recipients/application/use-cases/create-recipient-use-case';
import { ListAllRecipientsUseCase } from '@/domain/recipients/application/use-cases/list-all-recipients';
import { GetRecipientByIdUseCase } from '@/domain/recipients/application/use-cases/get-recipient-by-id-use-case';
import { DeleteRecipientUseCase } from '@/domain/recipients/application/use-cases/delete-recipient-use-case';
import { UpdateRecipientUseCase } from '@/domain/recipients/application/use-cases/update-recipient-use-case';
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository';
import { PrismaNotificationsRepository } from '../database/prisma/repository/prisma-notification-repository';
import { NotificationLogsRepository } from '@/domain/notification/application/repositories/notification-logs-repository';
import { PrismaNotificationLogsRepository } from '../database/prisma/repository/prisma-notification-logs-repository';
import { NotificationTemplateRepository } from '@/domain/notification/application/repositories/notification-template-repository';
import { PrismaNotificationTemplateRepository } from '../database/prisma/repository/prisma-notification-template-repository';
import { RecipientRepository } from '@/domain/recipients/application/repositories/recipient-repository';
import { PrismaRecipientRepository } from '../database/prisma/repository/prisma-recipient-repository';
import { UserLogoutController } from './controllers/user/user-logout-controller';
import { DeleteNotificationTemplateController } from './controllers/notification-template/delete-notification-templtate-controller';
import { DeleteNotificationTemplateUseCase } from '@/domain/notification/application/use-cases/notification-template/delete-template-use-case';
import { ListAllLogsController } from './controllers/notification-logs/list-all-logs-controller';
import { ListAllLogsUseCase } from '@/domain/notification/application/use-cases/notification-logs/list-all-logs-use-case';

@Module({
  imports: [DatabaseModule, CryptographyModule, NotificationDomainModule],
  controllers: [
    AuthenticateUserController,
    CreateUserController,
    GetUserByIdController,
    ListAllNotificationsController,
    CreateNotificationController,
    DeleteNotificationController,
    SaveNotificationController,
    GetNotificationLogsController,
    LogNotificationAttemptController,
    ListAllLogsController,
    CreateNotificationTemplateController,
    ListTemplatesController,
    GetTemplateByIdController,
    DeleteNotificationTemplateController,
    UpdateNotificationController,
    GetProfileController,
    CreateRecipientController,
    ListAllRecipientsController,
    GetRecipientByIdController,
    UpdateRecipientController,
    DeleteRecipientController,
    UserLogoutController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateUserUseCase,
    GetUserByIdUseCase,
    DeleteNotificationUseCase,
    SaveNotificationUseCase,
    GetNotificationLogsUseCaseUseCase,
    LogNotificationAttemptUseCase,
    CreateNotificationTemplateUseCase,
    ListNotificationTemplatesUseCase,
    GetNotificationTemplateByIdUseCase,
    UpdateNotificationTemplateUseCase,
    DeleteNotificationTemplateUseCase,
    CreateRecipientUseCase,
    ListAllRecipientsUseCase,
    GetRecipientByIdUseCase,
    UpdateRecipientUseCase,
    DeleteRecipientUseCase,
    ListAllLogsUseCase,
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
})
export class HttpModule {}
