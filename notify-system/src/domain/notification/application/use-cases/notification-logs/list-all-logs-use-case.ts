import { Injectable } from '@nestjs/common';
import { NotificationLogsRepository } from '../../repositories/notification-logs-repository';
import { NotificationLogs } from '@/domain/notification/enterprise/entities/notification-logs';

interface ListAllLogsResponse {
  logs: NotificationLogs[];
}

@Injectable()
export class ListAllLogsUseCase {
  constructor(private logsRepository: NotificationLogsRepository) {}

  async execute(): Promise<ListAllLogsResponse> {
    const logs = await this.logsRepository.listAll();

    return { logs: logs };
  }
}
