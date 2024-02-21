import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getMyProfile(email: string): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return {
      email: user.email,
      nama: user.nama,
    };
  }

  async getUserById(id: number): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return {
      email: user.email,
      nama: user.nama,
    };
  }
}
