import { User } from '@/domain/users/enterprise/entities/user';
import { UserPayload } from '@/infra/auth/jwt-strategy';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id-use-case';
import { UserPresenter } from '../../presenters/user-presenter';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: UserPayload;
}

@ApiTags('Users')
@Controller('users')
export class GetProfileController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user profile',
    content: {
      'application/json': {
        example: {
          id: '123',
          name: 'John Doe',
          email: 'user@example.com',
          createdAt: '2025-08-13T00:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: { statusCode: 401, message: 'Unauthorized' },
      },
    },
  })
  async getProfile(@Req() req: RequestWithUser) {
    const { user } = await this.getUserByIdUseCase.execute({
      id: new UniqueEntityID(req.user.sub),
    });

    return UserPresenter.toHTTP(user);
  }
}
