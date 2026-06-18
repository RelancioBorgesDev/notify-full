import { Controller, Get, HttpCode } from '@nestjs/common';
import { ListAllNotificationsUseCase } from '@/domain/notification/application/use-cases/list-all-notifications-use-case';
import { NotificationsPresenter } from '../../presenters/notifications-presenter';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  Channel,
  NotificationStatus,
} from '@/domain/notification/enterprise/entities/notification';

@ApiTags('Notifications')
@Controller('/notifications/list')
export class ListAllNotificationsController {
  constructor(
    private listAllNotificationsUseCase: ListAllNotificationsUseCase,
  ) {}

  @Get('')
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all notifications',
    description: 'Retrieves a list of all notifications in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of notifications retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Notification created successfully',
        },
        notifications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'abc123def-456g-789h-012i-345678901234',
              },
              recipientId: {
                type: 'string',
                example: '123e4567-e89b-12d3-a456-426614174000',
              },
              templateId: {
                type: 'string',
                example: '987fcdeb-51a2-43d7-8f9e-123456789abc',
              },
              channel: {
                type: 'string',
                enum: Object.values(Channel),
                example: Channel.EMAIL,
              },
              title: {
                type: 'string',
                example: 'Welcome to our platform!',
              },
              content: {
                type: 'string',
                example: 'Thank you for joining our platform.',
              },
              status: {
                type: 'string',
                enum: Object.values(NotificationStatus),
                example: NotificationStatus.PENDING,
              },
              priority: {
                type: 'integer',
                example: 1,
              },
              retries: {
                type: 'integer',
                example: 0,
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z',
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z',
              },
              scheduledAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2024-12-31T23:59:59.000Z',
              },
              readAt: {
                type: 'string',
                format: 'date-time',
                nullable: true,
                example: '2024-01-15T11:00:00.000Z',
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
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle() {
    const { notifications } = await this.listAllNotificationsUseCase.execute();


    return {
      message: 'Notification created successfully',
      notifications: notifications.map((notification) =>
        NotificationsPresenter.toHTTP(notification),
      ),
    };
  }
}
