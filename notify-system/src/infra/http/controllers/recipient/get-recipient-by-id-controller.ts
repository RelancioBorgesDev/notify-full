import { Controller, Delete, Get, HttpCode, Param } from '@nestjs/common';
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
import { RecipientPresenter } from '../../presenters/recipient-presenter';
import { GetRecipientByIdUseCase } from '@/domain/recipients/application/use-cases/get-recipient-by-id-use-case';

@ApiTags('Recipients')
@Controller('/recipients/:id')
export class GetRecipientByIdController {
  constructor(private getRecipientByIdUseCase: GetRecipientByIdUseCase) {}

  @Get('')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get a recipient by id',
    description: 'Get a recipient by id',
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
    description: 'Recipient found successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Recipient found successfully',
        },
        recipient: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'abc123def-456g-789h-012i-345678901234',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            pushToken: {
              type: 'string',
              example: 'abc123def-456g-789h-012i-345678901234',
            },
          },
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
    const { recipient } = await this.getRecipientByIdUseCase.execute({
      id: id,
    });

    return {
      message: 'Recipient found successfully',
      recipient: RecipientPresenter.toHTTP(recipient),
    };
  }
}
