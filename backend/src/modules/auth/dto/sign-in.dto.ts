import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninDto {
	@IsString()
	@IsNotEmpty()
	phone: string;

	@IsString()
	@Length(2)
	@IsNotEmpty()
	password: string;
}
