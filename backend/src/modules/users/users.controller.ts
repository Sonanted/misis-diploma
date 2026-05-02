import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	getCurrentUser(@Req() req: IAuthRequest): Promise<User> {
		return this.usersService.findOne({ id: req.user.id });
	}

	@Get()
	getAllUsers(): Promise<User[]> {
		return this.usersService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Delete('me')
	deleteCurrentUser(@Req() req: IAuthRequest): Promise<User> {
		return this.usersService.delete(req.user.id);
	}

	@Delete(':id')
	deleteUser(@Param('id') id: string): Promise<User> {
		return this.usersService.delete(id);
	}
}
