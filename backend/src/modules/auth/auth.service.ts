import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SigninDto } from './dto/sign-in.dto';
import { SignupDto } from './dto/sign-up.dto';
import { IJwtPayload } from './interfaces/IJwtPayload';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async signup(signupDto: SignupDto): Promise<{ access_token: string }> {
		const user = await this.userService.create(signupDto);

		return this.signin(user.id);
	}

	async signin(userId: string): Promise<{ access_token: string }> {
		const payload: IJwtPayload = { sub: userId };

		return { access_token: this.jwtService.sign(payload) };
	}

	async validateUser(signinDto: SigninDto): Promise<User> {
		const INVALID_CREDENTIALS = 'Неверный телефон или пароль';

		let user: User;
		try {
			user = await this.userService.findOneWithPassword({ phone: signinDto.phone });
		} catch {
			throw new UnauthorizedException(INVALID_CREDENTIALS);
		}

		const isMatch = await bcrypt.compare(signinDto.password, user.password);
		if (!isMatch) {
			throw new UnauthorizedException(INVALID_CREDENTIALS);
		}

		return user;
	}
}
