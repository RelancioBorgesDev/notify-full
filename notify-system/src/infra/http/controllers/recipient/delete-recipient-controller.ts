import {
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from '@nestjs/swagger';
import { DeleteRecipientUseCase } from '@/domain/recipients/application/use-cases/delete-recipient-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

@ApiTags('Recipients')
@Controller('/recipients/delete/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete('')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete a recipient',
    description: 'Deletes a recipient',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipient ID',
    required: true,
    type: 'string',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiResponse({
    status: 200,
    description: 'Recipient deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Recipient deleted successfully',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid id',
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
  async handle(@Param('id') id: UniqueEntityID) {
    const result = await this.deleteRecipientUseCase.execute({ id: id });

    return {
      message: 'Recipient deleted successfully',
    };
  }
}
