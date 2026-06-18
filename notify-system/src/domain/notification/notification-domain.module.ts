import { forwardRef, Module } from '@nestjs/common';
import { LogNotificationAttemptUseCase } from './application/use-cases/notification-logs/log-notification-attempt-use-case';
import { GetNotificationLogsUseCaseUseCase } from './application/use-cases/notification-logs/get-notification-logs-use-case';
import { CreateNotificationUseCase } from './application/use-cases/create-notification-use-case';
import { DeleteNotificationUseCase } from './application/use-cases/delete-notification-use-case';
import { SaveNotificationUseCase } from './application/use-cases/save-notification-use-case';
import { CreateNotificationTemplateUseCase } from './application/use-cases/notification-template/create-template-use-case';
import { ListNotificationTemplatesUseCase } from './application/use-cases/notification-template/list-templates-use-case';
import { GetNotificationTemplateByIdUseCase } from './application/use-cases/notification-template/get-template-by-id-use-case';
import { UpdateNotificationTemplateUseCase } from './application/use-cases/notification-template/update-template-use-case';
import { DatabaseModule } from '@/infra/database/database.module';
import { QueueModule } from '@/infra/queues/queue.module';
import { ProcessNotificationUseCase } from './application/use-cases/process-notification-use-case';
import { MailModule } from '@/infra/mail/mail.module';
import { GetUserByIdUseCase } from '../users/application/use-cases/get-user-by-id-use-case';
import { ListAllNotificationsUseCase } from './application/use-cases/list-all-notifications-use-case';
import { GetRecipientByIdUseCase } from '../recipients/application/use-cases/get-recipient-by-id-use-case';

@Module({
  imports: [DatabaseModule, forwardRef(() => QueueModule), MailModule],
  providers: [
    ListAllNotificationsUseCase,
    CreateNotificationUseCase,
    DeleteNotificationUseCase,
    SaveNotificationUseCase,
    GetNotificationLogsUseCaseUseCase,
    LogNotificationAttemptUseCase,
    CreateNotificationTemplateUseCase,
    ListNotificationTemplatesUseCase,
    GetNotificationTemplateByIdUseCase,
    UpdateNotificationTemplateUseCase,
    ProcessNotificationUseCase,
    GetUserByIdUseCase,
    GetRecipientByIdUseCase,
  ],
  exports: [
    ListAllNotificationsUseCase,
    CreateNotificationUseCase,
    DeleteNotificationUseCase,
    SaveNotificationUseCase,
    GetNotificationLogsUseCaseUseCase,
    LogNotificationAttemptUseCase,
    CreateNotificationTemplateUseCase,
    ListNotificationTemplatesUseCase,
    GetNotificationTemplateByIdUseCase,
    UpdateNotificationTemplateUseCase,
    ProcessNotificationUseCase,
    GetUserByIdUseCase,
    GetRecipientByIdUseCase,
  ],
})
export class NotificationDomainModule {}
