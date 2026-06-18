import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeleteNotificationTemplateUseCase } from '@/domain/notification/application/use-cases/notification-template/delete-template-use-case';
import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('NotificationTemplate')
@Controller('/notification/template')
export class DeleteNotificationTemplateController {
  constructor(
    private deleteNotificationTemplateUseCase: DeleteNotificationTemplateUseCase,
  ) {}

  @Delete(':templateId')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a notification template',
    description: 'Permanently deletes a notification template by its ID',
  })
  @ApiParam({
    name: 'templateId',
    type: 'string',
    description: 'Unique identifier of the notification template to delete',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiResponse({
    status: 204,
    description: 'Template deleted successfully (no content returned)',
  })
  @ApiBadRequestResponse({
    description: 'Invalid template ID format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid template ID format' },
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
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async handle(@Param('templateId') templateId: UniqueEntityID) {
    await this.deleteNotificationTemplateUseCase.execute({ templateId });
  }
}
