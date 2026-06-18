import { Body, UsePipes, HttpCode } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from '@/domain/users/application/use-cases/create-user-use-case';
import { UserStatus } from '@/domain/users/enterprise/entities/user';

const createUserBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  status: z.nativeEnum(UserStatus).optional(),
});

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

class CreateUserRequest {
  email: string;
  name: string;
  password: string;
  status: UserStatus;
}

class CreateUserResponse {
  message: string;
}

@ApiTags('Users')
@Controller('/accounts')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiBody({
    description: 'User data to create a new account',
    type: CreateUserRequest,
    examples: {
      valid: {
        value: {
          email: 'user@example.com',
          name: 'John Doe',
          password: 'strongPassword123',
          status: UserStatus.ACTIVE,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: ['email must be a valid email', 'password is required'],
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const { email, name, password, status } = createUserBodySchema.parse(body);

    await this.createUser.execute({
      email,
      name,
      password,
      status,
    });

    return { message: 'Usuário criado com sucesso !' };
  }
}
