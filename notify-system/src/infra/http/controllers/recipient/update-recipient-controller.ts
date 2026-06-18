import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import { UpdateRecipientUseCase } from '../../../../domain/recipients/application/use-cases/update-recipient-use-case';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RecipientPresenter } from '../../presenters/recipient-presenter';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

const updateRecipientBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  pushToken: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

type UpdateRecipientBodySchema = z.infer<typeof updateRecipientBodySchema>;

@ApiTags('Recipients')
@Controller('/recipients/update/:id')
export class UpdateRecipientController {
  constructor(private updateRecipientUseCase: UpdateRecipientUseCase) {}

  @Patch('')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Update a recipient',
    description: 'Updates a recipient',
  })
  @ApiParam({
    name: 'id',
    description: 'Recipient ID',
    required: true,
    type: 'string',
    example: 'abc123def-456g-789h-012i-345678901234',
  })
  @ApiBody({
    description: 'Recipient update data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          format: 'string',
          description: 'Name of the recipient',
          example: 'John Doe',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email of the recipient',
          example: 'john.doe@example.com',
        },
        phone: {
          type: 'string',
          description: 'Phone number of the recipient',
          example: '+1234567890',
        },
        pushToken: {
          type: 'string',
          description: 'Push token of the recipient',
          example: 'abc123def-456g-789h-012i-345678901234',
        },
        status: {
          type: 'string',
          description: 'Status of the recipient',
          example: UserStatus.ACTIVE,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Recipient updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Recipient updated successfully',
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
            status: {
              type: 'string',
              example: UserStatus.ACTIVE,
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
  async handle(
    @Param('id') idParam: string,
    @Body() body: UpdateRecipientBodySchema,
  ) {
    const id = new UniqueEntityID(idParam);
    const { email, name, phone, pushToken, status } = body;

    const { recipient } = await this.updateRecipientUseCase.execute({
      id,
      email,
      name,
      phone,
      pushToken,
      status,
    });

    return {
      message: 'Recipient updated successfully',
      recipient: RecipientPresenter.toHTTP(recipient),
    };
  }
}
