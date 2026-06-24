import { Body, Controller, Get, HttpCode, Post, Request, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../shared/guards/jwt.guard';
import { LocalAuthGuard } from '../../shared/guards/local.guard';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/sign-up.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import type { IAuthRequest } from './interfaces/IAuthRequest';

const COOKIE_NAME = 'access_token';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	@HttpCode(200)
	async signin(
		@Request() req: IAuthRequest,
		@Res({ passthrough: true }) res: Response,
	) {
		const { access_token } = await this.authService.signin(req.user.id);
		this.setAuthCookie(res, access_token);
		return { success: true };
	}

	@Post('signup')
	async signup(
		@Body() dto: SignupDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { access_token } = await this.authService.signup(dto);
		this.setAuthCookie(res, access_token);
		return { success: true };
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	me(@Request() req: IAuthRequest) {
		return this.userService.findOne({ id: req.user.id });
	}

	@Post('logout')
	@HttpCode(200)
	logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie(COOKIE_NAME, { httpOnly: true, sameSite: 'strict', path: '/' });
		return { success: true };
	}

	@Post('forgot-password/request')
	@HttpCode(200)
	async requestPasswordReset(@Body() dto: RequestResetDto) {
		const code = await this.authService.requestPasswordReset(dto.phone);
		return { code };
	}

	@Post('forgot-password/verify')
	@HttpCode(200)
	async verifyResetCode(@Body() dto: VerifyResetCodeDto) {
		await this.authService.verifyResetCode(dto.phone, dto.code);
		return { valid: true };
	}

	@Post('forgot-password/reset')
	@HttpCode(200)
	async resetPassword(@Body() dto: ResetPasswordDto) {
		await this.authService.resetPassword(dto.phone, dto.code, dto.newPassword);
		return { message: 'Пароль успешно изменён' };
	}

	private setAuthCookie(res: Response, token: string): void {
		const maxAge = Number(process.env.JWT_EXPIRES_IN_MS ?? 24 * 60 * 60 * 1000);
		res.cookie(COOKIE_NAME, token, {
			httpOnly: true,
			sameSite: 'strict',
			path: '/',
			maxAge,
			secure: process.env.COOKIE_SECURE === 'true',
		});
	}
}
