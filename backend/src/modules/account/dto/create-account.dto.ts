import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EAccountCurrency } from 'src/shared/enums/EAccountCurrency';
import { EAccountType } from 'src/shared/enums/EAccountType';

export class CreateAccountDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(EAccountType)
	@IsNotEmpty()
	type: EAccountType;

	@IsEnum(EAccountCurrency)
	@IsNotEmpty()
	currency: EAccountCurrency;

	@IsNumber()
	@IsOptional()
	interestRate?: number;
}
