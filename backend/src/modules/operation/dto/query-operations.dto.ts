import { Type } from 'class-transformer';
import { IsIn, IsInt, IsISO8601, IsOptional, IsString, Max, Min } from 'class-validator';

export type OperationDirection = 'incoming' | 'outgoing' | 'internal' | 'other';

export class QueryOperationsDto {
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(100)
	@Type(() => Number)
	limit: number = 20;

	@IsOptional()
	@IsInt()
	@Min(0)
	@Type(() => Number)
	offset: number = 0;

	@IsOptional()
	@IsIn(['incoming', 'outgoing', 'internal', 'other'])
	direction?: OperationDirection;

	@IsOptional()
	@IsString()
	type?: string;

	@IsOptional()
	@IsISO8601({ strict: false })
	dateFrom?: string;

	@IsOptional()
	@IsISO8601({ strict: false })
	dateTo?: string;
}
