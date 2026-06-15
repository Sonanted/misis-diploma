import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomConfigService } from '../../config/config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [CustomConfigService],
			useFactory: async (configService: CustomConfigService) => ({
				secret: configService.jwt.secret,
				signOptions: {
					expiresIn: Math.floor(configService.jwt.expiresIn / 1000),
				},
			}),
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
