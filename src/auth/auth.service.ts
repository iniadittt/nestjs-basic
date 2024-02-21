import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterResponse } from './types/register.response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { email, password, nama } = registerDto;
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw new HttpException(
        {
          error: true,
          code: HttpStatus.BAD_REQUEST,
          message: 'Email already exist',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword: string = await bcrypt.hash(password, 10);
    const createUser: User = await this.userRepository.save({
      email,
      password: hashPassword,
      nama,
    });
    return {
      email: createUser.email,
      nama: createUser.nama,
    };
  }

  async login(loginDto: LoginDto): Promise<string> {
    const { email, password } = loginDto;
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException(
        {
          error: true,
          code: HttpStatus.BAD_REQUEST,
          message: 'Email and password wrong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const matchPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!matchPassword) {
      throw new HttpException(
        {
          error: true,
          code: HttpStatus.BAD_REQUEST,
          message: 'Email and password wrong',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const payload: { email: string } = { email: user.email };
    const token: string = await this.jwtService.signAsync(payload);
    return token;
  }
}
