import { Body, UsePipes, Res, HttpStatus } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { Response } from 'express';
import { z } from 'zod';
import { Public } from '@/infra/auth/public';
import { AuthenticateUserUseCase } from '@/domain/users/application/use-cases/authenticate-user-use-case';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

class AuthenticateUserRequest {
  email: string;
  password: string;
}

class AuthenticateUserResponse {
  message: string;
  accessToken: string;
}

@ApiTags('Users')
@Controller('/sessions')
@Public()
export class AuthenticateUserController {
  constructor(private authenticateStudent: AuthenticateUserUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Authenticate User',
    description:
      'Authenticate a user using email and password. Returns an access token and sets a secure HTTP-only cookie for session management.',
  })
  @ApiBody({
    description: 'User credentials for authentication',
    type: AuthenticateUserRequest,
    examples: {
      valid: {
        value: {
          email: 'user@example.com',
          password: 'strongPassword123',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated',
    type: AuthenticateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid email or password',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Invalid email or password',
        },
      },
    },
  })
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema, @Res() res: Response) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    const { accessToken } = result;

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      path: '/',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.status(HttpStatus.OK).send({
      message: 'Authenticated successfully',
      accessToken,
    });
  }
}
