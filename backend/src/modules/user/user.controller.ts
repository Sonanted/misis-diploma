import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

	@UseGuards(JwtAuthGuard)
	@Patch('me')
	updateCurrentUser(@Req() req: IAuthRequest, @Body() dto: UpdateUserDto): Promise<User> {
		return this.userService.update(req.user.id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('me/password')
	@HttpCode(204)
	changePassword(@Req() req: IAuthRequest, @Body() dto: ChangePasswordDto): Promise<void> {
		return this.userService.changePassword(req.user.id, dto);
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
