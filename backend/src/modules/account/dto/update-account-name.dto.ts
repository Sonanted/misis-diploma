import { IsString } from 'class-validator';

export class UpdateAccountNameDto {
	@IsString()
	name: string;
}
