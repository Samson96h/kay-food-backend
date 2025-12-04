import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { SecretCode, User, UserSecurity } from '@app/common/database';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from '@app/common';
import { FacebookStrategy } from '@app/common/strategy/facebook.strategy';
import { GoogleStrategy } from '@app/common/strategy/google.strategy';
import { JwtStrategy } from '@app/common/strategy/jwt.strategy';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, SecretCode, UserSecurity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [AuthService, AuthGuard, GoogleStrategy,
    FacebookStrategy,
    JwtStrategy,
    ConfigService,],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }

