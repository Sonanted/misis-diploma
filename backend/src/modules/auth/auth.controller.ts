import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../../shared/guards/local.guard';
import { AuthService } from './auth.service';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/sign-up.dto';
import { VerifyResetCodeDto } from './dto/verify-reset-code.dto';
import type { IAuthRequest } from './interfaces/IAuthRequest';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('signin')
	@HttpCode(200)
	signin(@Request() req: IAuthRequest) {
		return this.authService.signin(req.user.id);
	}

	@Post('signup')
	signup(@Body() dto: SignupDto) {
		return this.authService.signup(dto);
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
}
