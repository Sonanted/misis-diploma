import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { QueryOperationsDto } from '../operation/dto/query-operations.dto';
import { OperationService } from '../operation/operation.service';
import { BANK_CONFIG } from './account.contants';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { TopupAccountDto } from './dto/topup-account.dto';
import { UpdateAccountNameDto } from './dto/update-account-name.dto';
import { UpdateAccountStatusDto } from './dto/update-account-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
	constructor(
		private readonly accountService: AccountService,
		private readonly operationService: OperationService,
	) {}

	@Post()
	create(@Req() req: IAuthRequest, @Body() createAccountDto: CreateAccountDto) {
		return this.accountService.create(req, createAccountDto);
	}

	@Get()
	findAll(@Req() req: IAuthRequest) {
		return this.accountService.findAll(req);
	}

	@Get('bank-info')
	getBankInfo() {
		return { bik: BANK_CONFIG.BIK, name: BANK_CONFIG.NAME };
	}

	@Get(':id')
	findOne(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.accountService.findOne(req, { id });
	}

	@Post(':id/topup')
	topup(@Req() req: IAuthRequest, @Param('id') id: string, @Body() dto: TopupAccountDto) {
		return this.accountService.topup(req, id, dto);
	}

	@Post(':id/monthly-payment')
	monthlyPayment(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.accountService.monthlyPayment(req, id);
	}

	@Patch(':id/primary')
	@HttpCode(204)
	setPrimary(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.accountService.setPrimary(req, id);
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

	@Get(':id/operations')
	getOperations(
		@Req() req: IAuthRequest,
		@Param('id') id: string,
		@Query() query: QueryOperationsDto,
	) {
		return this.operationService.findByAccount(id, req.user.id, query);
	}
}
