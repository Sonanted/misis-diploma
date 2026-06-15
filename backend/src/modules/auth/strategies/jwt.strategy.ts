import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomConfigService } from '../../../config/config.service';
import { IAuthUser } from '../interfaces/IAuthUser';
import { IJwtPayload } from '../interfaces/IJwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(customConfigService: CustomConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) =>
					(req.cookies as Record<string, string> | undefined)?.access_token ?? null,
			]),
			secretOrKey: customConfigService.jwt.secret,
		});
	}

	async validate(payload: IJwtPayload): Promise<IAuthUser> {
		return { id: payload.sub };
	}
}
