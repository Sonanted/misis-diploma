import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class ResolveDestinationDto {
	@IsIn(['account', 'phone', 'card'])
	method: 'account' | 'phone' | 'card';

	@IsString()
	@IsNotEmpty()
	recipientIdentifier: string;
}
