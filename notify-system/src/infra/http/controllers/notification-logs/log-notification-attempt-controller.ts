import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { LogNotificationAttemptUseCase } from '@/domain/notification/application/use-cases/notification-logs/log-notification-attempt-use-case';
import { LogStatus } from '@/domain/notification/enterprise/entities/notification-logs';
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

const logNotificationAttemptSchema = z.object({
  notificationId: z.string().uuid(),
  status: z.nativeEnum(LogStatus),
  response: z.string().optional(),
  errorMessage: z.string().optional(),
  attempt: z.number(),
  sentAt: z.coerce.date(),
});

type LogNotificationAttemptSchema = z.infer<
  typeof logNotificationAttemptSchema
>;

@ApiTags('NotificationLogs')
@Controller('/notifications/:notificationId/logs')
export class LogNotificationAttemptController {
  constructor(
    private logNotificationAttemptUseCase: LogNotificationAttemptUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(logNotificationAttemptSchema))
  @ApiOperation({
    summary: 'Log notification attempt',
    description:
      'Creates a new log entry for a notification delivery attempt, including status, response details, and error information',
  })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier of the notification to log attempt for',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiBody({
    description: 'Notification attempt log data',
    schema: {
      type: 'object',
      required: ['notificationId', 'status', 'attempt', 'sentAt'],
      properties: {
        notificationId: {
          type: 'string',
          format: 'uuid',
          description:
            'Unique identifier of the notification (should match URL parameter)',
          example: 'abc123def-456g-789h-012i-345678901234',
        },
        status: {
          type: 'string',
          enum: Object.values(LogStatus),
          description: 'Status of the delivery attempt',
          example: LogStatus.SUCCESS,
        },
        attempt: {
          type: 'integer',
          minimum: 1,
          description:
            'Attempt number for this delivery (1 for first attempt, 2 for first retry, etc.)',
          example: 1,
        },
        sentAt: {
          type: 'string',
          format: 'date-time',
          description: 'Timestamp when the delivery attempt was made',
          example: '2024-01-15T10:30:00.000Z',
        },
        response: {
          type: 'string',
          description:
            'Response message from the delivery service (for successful attempts)',
          example: 'Email sent successfully via SMTP server mail.example.com',
        },
        errorMessage: {
          type: 'string',
          description: 'Error message if the delivery attempt failed',
          example: 'SMTP connection timeout after 30 seconds',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Log entry created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Log created successfully',
        },
        log: {
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
              example: null,
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
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or validation errors',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'notificationId must be a valid UUID',
            'attempt must be a positive number',
            'sentAt must be a valid date',
          ],
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
        message: { type: 'string', example: 'Failed to create log entry' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle(
    @Param('notificationId') notificationId: string,
    @Body() body: z.infer<typeof logNotificationAttemptSchema>,
  ) {
    const { attempt, sentAt, status, errorMessage, response } = body;

    const result = await this.logNotificationAttemptUseCase.execute({
      notificationId: new UniqueEntityID(notificationId),
      attempt,
      sentAt,
      status,
      errorMessage,
      response,
    });

    return {
      message: 'Log created successfully',
      log: result.log,
    };
  }
}
