import { CreateNotificationUseCase } from '@/domain/notification/application/use-cases/create-notification-use-case';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import {
  Channel,
  NotificationStatus,
} from '@/domain/notification/enterprise/entities/notification';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

const createNotificationBodySchema = z.object({
  senderId: z.string().uuid().optional(),
  recipientId: z.string().uuid(),
  templateId: z.string().uuid().optional(),
  channel: z.nativeEnum(Channel),
  title: z.string(),
  content: z.string(),
  priority: z.number().int().min(0),
  scheduledAt: z.coerce.date().nullable().optional(),
});

type CreateNotificationBodySchema = z.infer<
  typeof createNotificationBodySchema
>;

@ApiTags('Notifications')
@Controller('/notifications/create')
export class CreateNotificationController {
  constructor(private createNotificationUseCase: CreateNotificationUseCase) {}

  @Post('')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createNotificationBodySchema))
  @ApiOperation({
    summary: 'Create a new notification',
    description:
      'Creates a new notification for a specific recipient using a template',
  })
  @ApiBody({
    description: 'Notification creation data',
    schema: {
      type: 'object',
      required: ['recipientId', 'channel', 'title', 'content', 'priority'],
      properties: {
        senderId: {
          type: 'string',
          format: 'uuid',
          description:
            'Unique identifier of the notification sender (optional)',
          example: '987fcdeb-51a2-43d7-8f9e-123456789abc',
        },
        recipientId: {
          type: 'string',
          format: 'uuid',
          description: 'Unique identifier of the notification recipient',
          example: '123e4567-e89b-12d3-a456-426614174000',
        },
        templateId: {
          type: 'string',
          format: 'uuid',
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
          example: 'Welcome to our platform!',
        },
        content: {
          type: 'string',
          description: 'Content body of the notification',
          example:
            'Thank you for joining our platform. Get started by exploring our features.',
        },
        priority: {
          type: 'integer',
          minimum: 0,
          description: 'Priority level of the notification (0 = lowest)',
          example: 1,
        },
        scheduledAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          description: 'Optional scheduled delivery time',
          example: '2024-12-31T23:59:59.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Notification created successfully',
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
          example: ['recipientId must be a valid UUID'],
        },
        error: { type: 'string', example: 'Bad Request' },
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
  async handle(@Body() body: CreateNotificationBodySchema) {
    const {
      senderId, 
      recipientId,
      templateId,
      channel,
      title,
      content,
      priority,
      scheduledAt,
    } = body;

    const { notification } = await this.createNotificationUseCase.execute({
      senderId: senderId ? new UniqueEntityID(senderId) : null,
      recipientId: new UniqueEntityID(recipientId),
      templateId: templateId ? new UniqueEntityID(templateId) : null,
      channel,
      title,
      content,
      priority,
      scheduledAt,
    });

    return {
      message: 'Notification created successfully',
      notificationId: notification.id?.toString(),
    };
  }
}
