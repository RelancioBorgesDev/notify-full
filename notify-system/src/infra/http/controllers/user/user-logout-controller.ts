import { Controller, Post, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users/logout')
export class UserLogoutController {
  @Post()
  @ApiOperation({
    summary: 'Logout user',
    description: 'Clears the JWT cookie and logs the user out.',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User logged out successfully',
    content: {
      'application/json': {
        example: {
          message: 'Logged out',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - if no valid session exists',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    },
  })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Logged out' };
  }
}
