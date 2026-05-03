import { ISigninDto } from '@shared/api/ISignInDto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninDto implements ISigninDto {
	@IsString()
	@IsNotEmpty()
	phone: string;

	@IsString()
	@Length(2)
	@IsNotEmpty()
	password: string;
}
