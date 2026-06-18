import { Body, Controller, HttpCode, Param, Put } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { Channel } from '@/domain/notification/enterprise/entities/notification';
import { UpdateNotificationTemplateUseCase } from '@/domain/notification/application/use-cases/notification-template/update-template-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotificationTemplatePresenter } from '../../presenters/notification-template-presenter';
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

const updateNotificationBodySchema = z.object({
  title: z.string().optional(),
  channel: z.nativeEnum(Channel).optional(),
  subject: z.string().nullable().optional(),
  content: z.string().optional(),
});

type UpdateNotificationBodySchema = z.infer<
  typeof updateNotificationBodySchema
>;

@ApiTags('NotificationTemplate')
@Controller('/notification/template/update')
export class UpdateNotificationController {
  constructor(
    private updateNotificationTemplateUseCase: UpdateNotificationTemplateUseCase,
  ) {}

  @Put(':templateId')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Update template',
    description:
      'Updates an existing notification template with new data. All fields are optional - only provided fields will be updated.',
  })
  @ApiParam({
    name: 'templateId',
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier of the template to update',
    example: 'tpl123def-456g-789h-012i-345678901234',
  })
  @ApiBody({
    description: 'Template update data (all fields are optional)',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Updated descriptive title for the template',
          example: 'Updated Welcome Email Template',
        },
        channel: {
          type: 'string',
          enum: Object.values(Channel),
          description: 'Updated communication channel for the template',
          example: Channel.EMAIL,
        },
        content: {
          type: 'string',
          description: 'Updated template content with optional placeholders',
          example:
            'Welcome back to our platform, {{userName}}! Check out our latest features.',
        },
        subject: {
          type: 'string',
          nullable: true,
          description:
            'Updated subject line (set to null to remove, mainly for EMAIL channel)',
          example: 'Welcome Back to Our Amazing Platform!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Template updated successfully!',
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
              example: 'Updated Welcome Email Template',
            },
            channel: {
              type: 'string',
              enum: Object.values(Channel),
              example: Channel.EMAIL,
            },
            subject: {
              type: 'string',
              nullable: true,
              example: 'Welcome Back to Our Amazing Platform!',
            },
            content: {
              type: 'string',
              example:
                'Welcome back to our platform, {{userName}}! Check out our latest features.',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T11:45:00.000Z',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or template ID format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'templateId must be a valid UUID',
            'title should not be empty if provided',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Template not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Template not found' },
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
        message: { type: 'string', example: 'Failed to update template' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle(
    @Param('templateId') templateId: string,
    @Body(new ZodValidationPipe(updateNotificationBodySchema))
    body: UpdateNotificationBodySchema,
  ) {
    const { title, channel, subject, content } = body;

    const result = await this.updateNotificationTemplateUseCase.execute({
      templateId: new UniqueEntityID(templateId),
      title,
      channel,
      subject,
      content,
    });

    return {
      message: 'Template updated successfully!',
      template: NotificationTemplatePresenter.toHTTP(result.template),
    };
  }
}
