import { Get, Param, UsePipes, Controller, HttpCode } from '@nestjs/common';
import { z } from 'zod';
import { Public } from '@/infra/auth/public';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { GetUserByIdUseCase } from '@/domain/users/application/use-cases/get-user-by-id-use-case';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { UserPresenter } from '../../presenters/user-presenter';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

const getUserByIdSchema = z.object({
  userId: z.string(),
});

type GetUserByIdDto = z.infer<typeof getUserByIdSchema>;

class GetUserByIdResponse {
  message: string;
  user?: ReturnType<typeof UserPresenter.toHTTP>;
}

@ApiTags('Users')
@Controller('/user')
@Public()
export class GetUserByIdController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  @Get(':userId')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'userId',
    description: 'Unique ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: GetUserByIdResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    content: {
      'application/json': { example: { message: 'Usuário não encontrado' } },
    },
  })
  @UsePipes(new ZodValidationPipe(getUserByIdSchema))
  async getUser(@Param() params: GetUserByIdDto) {
    const { user } = await this.getUserByIdUseCase.execute({
      id: new UniqueEntityID(params.userId),
    });

    if (!user) {
      return { message: 'Usuário não encontrado' };
    }

    return {
      message: 'Usuário encontrado',
      user: UserPresenter.toHTTP(user),
    };
  }
}
