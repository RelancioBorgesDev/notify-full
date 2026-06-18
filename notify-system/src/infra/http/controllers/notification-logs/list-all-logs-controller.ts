import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ListAllLogsUseCase } from '@/domain/notification/application/use-cases/notification-logs/list-all-logs-use-case';
import { NotificationLogsPresenter } from '../../presenters/notification-logs-presenter';

@ApiTags('NotificationLogs')
@Controller('/notification/logs/list')
export class ListAllLogsController {
  constructor(private listAllLogsUseCase: ListAllLogsUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all logs',
    description: 'Lists all logs',
  })
  @ApiResponse({
    status: 200,
    description: 'Logs listed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logs listed successfully',
        },
        logs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'abc123def-456g-789h-012i-345678901234',
              },
              notificationId: {
                type: 'string',
                example: 'John Doe',
              },
              attempt: {
                type: 'number',
                example: 1,
              },
              response: {
                type: 'string',
                example: '+1234567890',
              },
              status: {
                type: 'string',
                example: 'SUCCESS',
              },
              errorMessage: {
                type: 'string',
                example: 'error',
              },
              sentAt: {
                type: 'string',
                example: '2025-09-04T19:27:09.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['notificationId must be a valid UUID'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async handle() {
    const { logs } = await this.listAllLogsUseCase.execute();

    return {
      message: 'Logs listed successfully',
      logs: logs.map((log) => NotificationLogsPresenter.toHTTP(log)),
    };
  }
}
