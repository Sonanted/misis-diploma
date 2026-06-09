import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferResult, TransferService } from './transfer.service';

@UseGuards(JwtAuthGuard)
@Controller('transfers')
export class TransferController {
	constructor(private readonly transferService: TransferService) {}

	@Post()
	transfer(@Req() req: IAuthRequest, @Body() dto: CreateTransferDto): Promise<TransferResult> {
		return this.transferService.transfer(req, dto);
	}
}
