import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { CustomConfigService } from 'config/config.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(customConfigService: CustomConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: customConfigService.jwt.secret,
      expiresIn: customConfigService.jwt.expiresIn,
    });
  }

  async validate(payload: { sub: number }) {
    return { userId: payload.sub };
  }
}