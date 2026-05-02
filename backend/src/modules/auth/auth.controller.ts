import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../../common/guards/local.guard';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/sign-up.dto';
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
		console.log('DTO:', dto);
		return this.authService.signup(dto);
	}
}
