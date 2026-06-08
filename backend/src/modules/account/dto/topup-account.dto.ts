import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TopupAccountDto {
	@IsNumber({ maxDecimalPlaces: 2 })
	amount: number;

	@IsString()
	@IsNotEmpty()
	password: string;
}
