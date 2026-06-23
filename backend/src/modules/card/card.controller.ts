import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { QueryOperationsDto } from '../operation/dto/query-operations.dto';
import { OperationService } from '../operation/operation.service';
import { CardService } from './card.service';
import { ChangeCardPinDto } from './dto/change-card-pin.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardStatusDto } from './dto/update-card-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardController {
	constructor(
		private readonly cardService: CardService,
		private readonly operationService: OperationService,
	) {}

	@Get()
	findAll(@Req() req: IAuthRequest) {
		return this.cardService.findAll(req);
	}

	@Get(':id')
	findOne(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.cardService.findOne(req, id);
	}

	@Get(':id/reveal')
	revealCardData(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.cardService.revealCardData(req, id);
	}

	@Get(':id/pin')
	revealPin(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.cardService.revealPin(req, id);
	}

	@Post()
	create(@Req() req: IAuthRequest, @Body() dto: CreateCardDto) {
		return this.cardService.create(req, dto);
	}

	@Patch(':id/status')
	updateStatus(@Req() req: IAuthRequest, @Param('id') id: string, @Body() dto: UpdateCardStatusDto) {
		return this.cardService.updateStatus(req, id, dto);
	}

	@Patch(':id/pin')
	@HttpCode(204)
	changePin(@Req() req: IAuthRequest, @Param('id') id: string, @Body() dto: ChangeCardPinDto) {
		return this.cardService.changePin(req, id, dto);
	}

	@Get(':id/operations')
	getOperations(
		@Req() req: IAuthRequest,
		@Param('id') id: string,
		@Query() query: QueryOperationsDto,
	) {
		return this.operationService.findByCard(id, req.user.id, query);
	}
}
