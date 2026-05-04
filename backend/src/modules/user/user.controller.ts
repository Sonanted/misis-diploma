import { Controller, Delete, Get, HttpCode, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	getCurrentUser(@Req() req: IAuthRequest): Promise<User> {
		return this.userService.findOne({ id: req.user.id });
	}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.userService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	@HttpCode(204)
	deleteCurrentUser(@Req() req: IAuthRequest): Promise<User> {
		return this.userService.delete(req.user.id);
	}

	@Delete(':id')
	@HttpCode(204)
	deleteUser(@Param('id') id: string): Promise<User> {
		return this.userService.delete(id);
	}
}
