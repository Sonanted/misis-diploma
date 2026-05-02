import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { EnvKey } from './config.types';
import { Env } from './config.schema';

@Injectable()
export class CustomConfigService {
  constructor(private readonly config: NestConfigService) {}

  get<K extends EnvKey>(key: K): Env[K] {
    const value = this.config.get<Env[K]>(key);

    if (value === undefined) {
      throw new Error(`Config key "${String(key)}" is not defined`);
    }

    return value;
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
}