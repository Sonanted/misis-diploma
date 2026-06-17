import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import type { Env } from './config.schema';
import type { EnvKey } from './config.types';

@Injectable()
export class CustomConfigService {
	constructor(private readonly config: NestConfigService) {}

	get<K extends EnvKey>(key: K): Env[K] {
		return this.config.getOrThrow<Env[K]>(key);
	}

	get saltRounds() {
		return this.get('SALT_ROUNDS');
	}

	get jwt() {
		return {
			secret: this.get('JWT_SECRET'),
			expiresIn: this.get('JWT_EXPIRES_IN_MS'),
		};
	}

	get topupPassword() {
		return this.get('TOPUP_PASSWORD');
	}

	get db() {
		return {
			host: this.get('DB_HOST'),
			port: this.get('DB_PORT'),
			username: this.get('DB_USERNAME'),
			password: this.get('DB_PASSWORD'),
			name: this.get('DB_NAME'),
		};
	}

	get frontendUrl() {
		return this.get('FRONTEND_URL');
	}
}
