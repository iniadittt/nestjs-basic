import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'database/database.module';
import { userProviders } from 'user/user.providers';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret_key'),
        signOptions: { expiresIn: configService.get<string>('expired_token') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [...userProviders, AuthService],
})
export class AuthModule {}
