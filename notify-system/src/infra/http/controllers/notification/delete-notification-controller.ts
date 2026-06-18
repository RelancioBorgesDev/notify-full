import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DeleteNotificationUseCase } from '@/domain/notification/application/use-cases/delete-notification-use-case';
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

@ApiTags('Notifications')
@Controller('/notifications')
export class DeleteNotificationController {
  constructor(private deleteNotificationUseCase: DeleteNotificationUseCase) {}

  @Delete(':notificationId')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a notification',
    description: 'Permanently deletes a notification by its ID',
  })
  @ApiParam({
    name: 'notificationId',
    type: 'string',
    description: 'Unique identifier of the notification to delete',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiResponse({
    status: 204,
    description: 'Notification deleted successfully (no content returned)',
  })
  @ApiBadRequestResponse({
    description: 'Invalid notification ID format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid notification ID format' },
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
  async handle(@Param('notificationId') notificationId: UniqueEntityID) {
    await this.deleteNotificationUseCase.execute({ notificationId });
  }
}
