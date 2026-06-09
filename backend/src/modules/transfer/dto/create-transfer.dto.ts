import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateTransferDto {
	@IsString()
	@IsNotEmpty()
	fromAccountId: string;

	@IsIn(['account', 'phone', 'card'])
	method: 'account' | 'phone' | 'card';

	@IsString()
	@IsNotEmpty()
	recipientIdentifier: string;

	@IsNumber()
	@Min(0.01)
	amount: number;

	@IsString()
	@IsOptional()
	description?: string;
}
