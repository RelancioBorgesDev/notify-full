import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { CreateNotificationTemplateUseCase } from '@/domain/notification/application/use-cases/notification-template/create-template-use-case';
import { NotificationTemplatePresenter } from '../../presenters/notification-template-presenter';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

const createNotificationTemplateBodySchema = z.object({
  title: z.string(),
  channel: z.nativeEnum(Channel),
  subject: z.string().optional(),
  content: z.string(),
});

type CreateNotificationTemplateBodySchema = z.infer<
  typeof createNotificationTemplateBodySchema
>;

@ApiTags('NotificationTemplate')
@Controller('/notification/template')
export class CreateNotificationTemplateController {
  constructor(
    private createNotificationTemplateUseCase: CreateNotificationTemplateUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createNotificationTemplateBodySchema))
  @ApiOperation({
    summary: 'Create notification template',
    description:
      'Creates a new notification template that can be reused for sending notifications across different channels',
  })
  @ApiBody({
    description: 'Template creation data',
    schema: {
      type: 'object',
      required: ['title', 'channel', 'content'],
      properties: {
        title: {
          type: 'string',
          description: 'Descriptive title for the template',
          example: 'Welcome Email Template',
        },
        channel: {
          type: 'string',
          enum: Object.values(Channel),
          description: 'Communication channel this template is designed for',
          example: Channel.EMAIL,
        },
        content: {
          type: 'string',
          description:
            'Template content with optional placeholders for personalization',
          example:
            'Welcome to our platform, {{userName}}! Start exploring our amazing features.',
        },
        subject: {
          type: 'string',
          description:
            'Subject line for email templates (optional, mainly used for EMAIL channel)',
          example: 'Welcome to Our Amazing Platform!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Template created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Template was successfully created',
        },
        template: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'tpl123def-456g-789h-012i-345678901234',
            },
            title: {
              type: 'string',
              example: 'Welcome Email Template',
            },
            channel: {
              type: 'string',
              enum: Object.values(Channel),
              example: Channel.EMAIL,
            },
            subject: {
              type: 'string',
              nullable: true,
              example: 'Welcome to Our Amazing Platform!',
            },
            content: {
              type: 'string',
              example:
                'Welcome to our platform, {{userName}}! Start exploring our amazing features.',
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
          },
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
          example: ['title should not be empty', 'content should not be empty'],
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
        message: { type: 'string', example: 'Failed to create template' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle(@Body() body: CreateNotificationTemplateBodySchema) {
    const { content, channel, title, subject } = body;

    const result = await this.createNotificationTemplateUseCase.execute({
      content,
      channel,
      title,
      subject,
    });

    return {
      message: 'Template was successfully created',
      template: NotificationTemplatePresenter.toHTTP(result.template),
    };
  }
}
