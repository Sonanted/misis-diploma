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

	async requestPasswordReset(phone: string): Promise<string | null> {
		const code = Math.floor(100000 + Math.random() * 900000).toString();
		const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
		// Returns the code only when the phone exists; null otherwise
		// TODO: replace returned code with SMS delivery
		return this.userService.saveResetCode(phone, code, expiresAt);
	}

	async verifyResetCode(phone: string, code: string): Promise<void> {
		await this.userService.findByResetCode(phone, code);
	}

	async resetPassword(phone: string, code: string, newPassword: string): Promise<void> {
		const user = await this.userService.findByResetCode(phone, code);
		await this.userService.resetPasswordByCode(user.id, newPassword);
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
