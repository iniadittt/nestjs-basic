import {
  Controller,
  Body,
  UsePipes,
  Post,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidationPipe } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponse } from './types/register.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    try {
      const user: RegisterResponse =
        await this.authService.register(registerDto);
      return {
        error: false,
        code: HttpStatus.CREATED,
        message: 'Registration successfully',
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

  @Post('login')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const token: string = await this.authService.login(loginDto);
      return {
        error: false,
        code: HttpStatus.OK,
        message: 'Login successfully',
        data: { token },
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
