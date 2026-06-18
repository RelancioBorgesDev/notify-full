import { Controller, Get, HttpCode, Param, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { GetNotificationLogsUseCaseUseCase } from '@/domain/notification/application/use-cases/notification-logs/get-notification-logs-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { LogStatus } from '@/domain/notification/enterprise/entities/notification-logs';

const getNotificationLogsSchema = z.object({
  notificationId: z.string().uuid(),
});

type GetNotificationLogsSchema = z.infer<typeof getNotificationLogsSchema>;

@ApiTags('NotificationLogs')
@Controller('/notifications/:notificationId/logs')
export class GetNotificationLogsController {
  constructor(
    private getNotificationLogsUseCase: GetNotificationLogsUseCaseUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getNotificationLogsSchema))
  @ApiOperation({
    summary: 'Get notification logs',
    description:
      'Retrieves all logs for a specific notification, including delivery attempts, status changes, and errors',
  })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier of the notification to get logs for',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification logs retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Logs fetched successfully',
        },
        logs: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'log123def-456g-789h-012i-345678901234',
              },
              notificationId: {
                type: 'string',
                example: 'abc123def-456g-789h-012i-345678901234',
              },
              status: {
                type: 'string',
                enum: Object.values(LogStatus),
                example: LogStatus.SUCCESS,
              },
              attempt: {
                type: 'integer',
                minimum: 1,
                example: 1,
              },
              sentAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z',
              },
              response: {
                type: 'string',
                nullable: true,
                example: 'Email sent successfully via SMTP',
              },
              errorMessage: {
                type: 'string',
                nullable: true,
                example: 'SMTP connection timeout after 30 seconds',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z',
              },
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid notification ID format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['notificationId must be a valid UUID'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Notification not found or no logs available',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Notification not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle(@Param() params: GetNotificationLogsSchema) {
    const { notificationId } = params;

    const result = await this.getNotificationLogsUseCase.execute({
      notificationId: new UniqueEntityID(notificationId),
    });

    return {
      message: 'Logs fetched successfully',
      logs: result.notificationLogs,
    };
  }
}
