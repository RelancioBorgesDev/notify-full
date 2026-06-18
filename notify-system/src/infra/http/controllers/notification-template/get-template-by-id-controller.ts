import { Controller, Get, HttpCode, Param, UsePipes } from '@nestjs/common';
import { z } from 'zod';
import { GetNotificationTemplateByIdUseCase } from '@/domain/notification/application/use-cases/notification-template/get-template-by-id-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { NotificationTemplatePresenter } from '../../presenters/notification-template-presenter';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Channel } from '@/domain/notification/enterprise/entities/notification';

const getNotificationTemplateByIdSchema = z.object({
  templateId: z.string().uuid(),
});

type GetTemplateByIdParams = z.infer<typeof getNotificationTemplateByIdSchema>;

@ApiTags('NotificationTemplate')
@Controller('/notification/template')
export class GetTemplateByIdController {
  constructor(
    private getNotificationTemplateByIdUseCase: GetNotificationTemplateByIdUseCase,
  ) {}

  @Get(':templateId')
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(getNotificationTemplateByIdSchema))
  @ApiOperation({
    summary: 'Get template by ID',
    description:
      'Retrieves a specific notification template by its unique identifier',
  })
  @ApiParam({
    name: 'templateId',
    type: 'string',
    format: 'uuid',
    description: 'Unique identifier of the template to retrieve',
    example: 'tpl123def-456g-789h-012i-345678901234',
  })
  @ApiResponse({
    status: 200,
    description: 'Template found successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Template was found',
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
    description: 'Invalid template ID format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['templateId must be a valid UUID'],
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
        message: { type: 'string', example: 'Failed to retrieve template' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle(@Param() params: GetTemplateByIdParams) {
    const { templateId } = params;

    const result = await this.getNotificationTemplateByIdUseCase.execute({
      templateId: new UniqueEntityID(templateId),
    });

    return {
      message: 'Template was found',
      template: NotificationTemplatePresenter.toHTTP(result.template),
    };
  }
}
