import { Body, Controller, Get, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { CardService } from './card.service';
import { ChangeCardPinDto } from './dto/change-card-pin.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardStatusDto } from './dto/update-card-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('cards')
export class CardController {
	constructor(private readonly cardService: CardService) {}

	// Endpoint #1: get all cards for the authenticated user
	@Get()
	findAll(@Req() req: IAuthRequest) {
		return this.cardService.findAll(req);
	}

	// Endpoint #2: get card detail by id
	@Get(':id')
	findOne(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.cardService.findOne(req, id);
	}

	// Endpoint #3: create a card for a given account
	@Post()
	create(@Req() req: IAuthRequest, @Body() dto: CreateCardDto) {
		return this.cardService.create(req, dto);
	}

	// Endpoint #4/#5: lock/unlock or close a card
	@Patch(':id/status')
	updateStatus(@Req() req: IAuthRequest, @Param('id') id: string, @Body() dto: UpdateCardStatusDto) {
		return this.cardService.updateStatus(req, id, dto);
	}

	// Endpoint #6: change card PIN
	@Patch(':id/pin')
	@HttpCode(204)
	changePin(@Req() req: IAuthRequest, @Param('id') id: string, @Body() dto: ChangeCardPinDto) {
		return this.cardService.changePin(req, id, dto);
	}
}
