import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import type { IAuthRequest } from '../auth/interfaces/IAuthRequest';
import { QueryOperationsDto } from './dto/query-operations.dto';
import { OperationService } from './operation.service';

@UseGuards(JwtAuthGuard)
@Controller('operations')
export class OperationController {
	constructor(private readonly operationService: OperationService) {}

	@Get()
	findAll(@Req() req: IAuthRequest, @Query() query: QueryOperationsDto) {
		return this.operationService.findAllForUser(req.user.id, query);
	}

	@Get(':id')
	findOne(@Req() req: IAuthRequest, @Param('id') id: string) {
		return this.operationService.findOne(id, req.user.id);
	}
}
