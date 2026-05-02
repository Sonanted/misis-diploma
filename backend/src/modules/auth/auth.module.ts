import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'modules/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomConfigService } from 'config/config.service';

import { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [CustomConfigService],
      useFactory: async (configService: CustomConfigService) => ({
        secret: 'super-secret-key',
        signOptions: {
          expiresIn: configService.jwt.expiresIn,
        },
      }),
  }),
  UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
