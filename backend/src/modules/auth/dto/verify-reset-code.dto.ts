import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyResetCodeDto {
	@IsString()
	@IsNotEmpty()
	phone: string;

	@IsString()
	@Length(6, 6)
	code: string;
}
