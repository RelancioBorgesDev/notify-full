import { Controller, Get, HttpCode } from '@nestjs/common';
import { ListNotificationTemplatesUseCase } from '@/domain/notification/application/use-cases/notification-template/list-templates-use-case';
import { NotificationTemplatePresenter } from '../../presenters/notification-template-presenter';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { Channel } from '@/domain/notification/enterprise/entities/notification';

@ApiTags('NotificationTemplate')
@Controller('/notification/template/list')
export class ListTemplatesController {
  constructor(
    private readonly listNotificationTemplatesUseCase: ListNotificationTemplatesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all templates',
    description:
      'Retrieves a list of all available notification templates in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Templates retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Templates were found',
        },
        templates: {
          type: 'array',
          items: {
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
          example: [
            {
              id: 'tpl123def-456g-789h-012i-345678901234',
              title: 'Welcome Email Template',
              channel: 'EMAIL',
              subject: 'Welcome to Our Platform!',
              content: 'Welcome {{userName}}! Thanks for joining us.',
              createdAt: '2024-01-15T10:30:00.000Z',
              updatedAt: '2024-01-15T10:30:00.000Z',
            },
            {
              id: 'tpl456abc-789d-012e-345f-678901234567',
              title: 'Password Reset SMS',
              channel: 'SMS',
              subject: null,
              content: 'Your password reset code is: {{resetCode}}',
              createdAt: '2024-01-14T15:20:00.000Z',
              updatedAt: '2024-01-14T15:20:00.000Z',
            },
          ],
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
        message: { type: 'string', example: 'Failed to retrieve templates' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle() {
    const result = await this.listNotificationTemplatesUseCase.execute();

    return {
      message: 'Templates were found',
      templates: result.templates.map((template) =>
        NotificationTemplatePresenter.toHTTP(template),
      ),
    };
  }
}
