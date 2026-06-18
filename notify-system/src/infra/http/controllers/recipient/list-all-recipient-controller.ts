import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ListAllRecipientsUseCase } from '@/domain/recipients/application/use-cases/list-all-recipients';
import { RecipientPresenter } from '../../presenters/recipient-presenter';

@ApiTags('Recipients')
@Controller('/recipients/list')
export class ListAllRecipientsController {
  constructor(private listAllRecipientsUseCase: ListAllRecipientsUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({
    summary: 'List all recipients',
    description: 'Lists all recipients',
  })
  @ApiResponse({
    status: 200,
    description: 'Recipients listed successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Recipients listed successfully',
        },
        recipients: {
          type: 'array',
          items: {
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
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['recipientId must be a valid UUID'],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async handle() {
    const { recipients } = await this.listAllRecipientsUseCase.execute();

    return {
      message: 'Recipients listed successfully',
      recipients: recipients.map((recipient) =>
        RecipientPresenter.toHTTP(recipient),
      ),
    };
  }
}
