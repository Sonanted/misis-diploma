import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CustomConfigService } from '../../config/config.service';

@Injectable()
export class HashService {
  constructor(private readonly customConfigService: CustomConfigService) {}

  hash(password: string) {
    const saltRounds = this.customConfigService.saltRounds;
    if (!saltRounds) {
      throw new Error('Salt rounds not configured');
    }

    return bcrypt.hash(
      password,
      saltRounds,
    );
  }

  compare(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}