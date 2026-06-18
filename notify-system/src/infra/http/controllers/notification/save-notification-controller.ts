import { SaveNotificationUseCase } from '@/domain/notification/application/use-cases/save-notification-use-case';
import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import {
  Channel,
  NotificationStatus,
} from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationContent } from '@/domain/notification/enterprise/value-object/notification-content';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

const saveNotificationBodySchema = z.object({
  templateId: z.string(),
  channel: z.nativeEnum(Channel),
  title: z.string(),
  content: z.string(),
  status: z.nativeEnum(NotificationStatus),
  priority: z.number().int().min(0),
  retries: z.number().int().min(0),
  error: z.string().optional(),
  readAt: z.coerce.date().nullable().optional(),
  scheduledAt: z.coerce.date().nullable().optional(),
});

type SaveNotificationBodySchema = z.infer<typeof saveNotificationBodySchema>;

@ApiTags('Notifications')
@Controller('/notifications')
export class SaveNotificationController {
  constructor(private saveNotificationUseCase: SaveNotificationUseCase) {}

  @Put(':notificationId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update a notification',
    description: 'Updates an existing notification with new data',
  })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    description: 'Unique identifier of the notification to update',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiBody({
    description: 'Notification update data',
    schema: {
      type: 'object',
      required: [
        'templateId',
        'channel',
        'title',
        'content',
        'status',
        'priority',
        'retries',
      ],
      properties: {
        templateId: {
          type: 'string',
          description: 'Unique identifier of the notification template',
          example: '987fcdeb-51a2-43d7-8f9e-123456789abc',
        },
        channel: {
          type: 'string',
          enum: Object.values(Channel),
          description: 'Communication channel for the notification',
          example: Channel.EMAIL,
        },
        title: {
          type: 'string',
          description: 'Title of the notification',
          example: 'Updated notification title',
        },
        content: {
          type: 'string',
          description: 'Content body of the notification',
          example: 'Updated notification content',
        },
        status: {
          type: 'string',
          enum: Object.values(NotificationStatus),
          description: 'Current status of the notification',
          example: NotificationStatus.SENT,
        },
        priority: {
          type: 'integer',
          minimum: 0,
          description: 'Priority level of the notification (0 = lowest)',
          example: 2,
        },
        retries: {
          type: 'integer',
          minimum: 0,
          description: 'Number of delivery retry attempts',
          example: 1,
        },
        error: {
          type: 'string',
          description: 'Error message if notification failed',
          example: 'SMTP connection timeout',
          nullable: true,
        },
        readAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          description: 'Timestamp when notification was read',
          example: '2024-01-15T11:00:00.000Z',
        },
        scheduledAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          description: 'Scheduled delivery time',
          example: '2024-12-31T23:59:59.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Notification updated successfully',
        },
        notificationId: {
          type: 'string',
          example: 'abc123def-456g-789h-012i-345678901234',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['priority must be a positive integer'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Notification not found',
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
  async handle(
    @Param('notificationId') id: string,
    @Body(new ZodValidationPipe(saveNotificationBodySchema))
    body: SaveNotificationBodySchema,
  ) {
    const {
      templateId,
      channel,
      title,
      content,
      status,
      priority,
      retries,
      error,
      readAt,
      scheduledAt,
    } = body;

    await this.saveNotificationUseCase.execute({
      id: new UniqueEntityID(id),
      updates: {
        title,
        content: NotificationContent.create(content),
        templateId: new UniqueEntityID(templateId),
        channel,
        status,
        priority,
        retries,
        error,
        readAt,
        scheduledAt,
      },
    });

    return {
      message: 'Notification updated successfully',
      notificationId: id,
    };
  }
}
