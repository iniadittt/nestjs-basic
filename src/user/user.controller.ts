import {
  Controller,
  Req,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { AuthGuard } from 'auth/auth.guard';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyProfile(@Req() request: Request): Promise<any> {
    try {
      const email: string = request?.body.email;
      const user: User = await this.userService.getMyProfile(email);
      return {
        error: false,
        code: HttpStatus.OK,
        data: user,
      };
    } catch (error: any) {
      return new HttpException(
        {
          error: true,
          code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param() { id }: { id: string }): Promise<any> {
    try {
      const numberId = parseInt(id);
      if (!numberId) {
        throw new HttpException(
          {
            error: true,
            code: HttpStatus.BAD_REQUEST,
            message: 'Parameter harus number',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const user: User = await this.userService.getUserById(numberId);
      return {
        error: false,
        code: HttpStatus.OK,
        data: user,
      };
    } catch (error: any) {
      return new HttpException(
        {
          error: true,
          code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.response.message || error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
