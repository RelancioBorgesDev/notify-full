import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';
import { CreateRecipientUseCase } from '../../../../domain/recipients/application/use-cases/create-recipient-use-case';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

const createRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  pushToken: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>;

@ApiTags('Recipients')
@Controller('/recipients/create')
export class CreateRecipientController {
  constructor(private createRecipientUseCase: CreateRecipientUseCase) {}

  @Post('')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  @ApiOperation({
    summary: 'Create a new recipient',
    description: 'Creates a new recipient',
  })
  @ApiBody({
    description: 'Recipient creation data',
    schema: {
      type: 'object',
      required: ['name', 'email'],
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
    status: 201,
    description: 'Recipient created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Recipient created successfully',
        },
        recipientId: {
          type: 'string',
          example: 'abc123def-456g-789h-012i-345678901234',
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
  async handle(@Body() body: CreateRecipientBodySchema) {
    const { email, name, phone, pushToken, status } = body;

    const { recipient } = await this.createRecipientUseCase.execute({
      email,
      name,
      phone,
      pushToken,
      status,
    });

    return {
      message: 'Recipient created successfully',
      recipientId: recipient.id?.toString(),
    };
  }
}
