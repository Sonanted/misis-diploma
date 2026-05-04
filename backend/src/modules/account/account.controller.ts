import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountNameDto } from './dto/update-account-name.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
	constructor(private readonly accountService: AccountService) {}

	@Post()
	create(@Req() req: IAuthRequest, @Body() createAccountDto: CreateAccountDto) {
		return this.accountService.create(req, createAccountDto);
	}

	@Get()
	findAll() {
		return this.accountService.findAll();
	}

	@Get(':id')
	findOne(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.accountService.findOne(req, { id });
	}

	@Patch(':id/name')
	updateName(@Req() req: IAuthRequest, @Param('id') id: string, @Body() dto: UpdateAccountNameDto) {
		return this.accountService.updateName(req, id, dto);
	}

	@Patch(':id/status')
	updateStatus(
		@Req() req: IAuthRequest,
		@Param('id') id: string,
		@Body() dto: UpdateAccountStatusDto,
	) {
		return this.accountService.updateStatus(req, id, dto);
	}

	@Delete(':id')
	@HttpCode(204)
	remove(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.accountService.remove(req, id);
	}
}
