import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCardDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	accountId: string;
}
