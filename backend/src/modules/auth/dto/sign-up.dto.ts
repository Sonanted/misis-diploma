import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
	@IsString()
	@MinLength(2)
	firstName: string;

	@IsString()
	@MinLength(2)
	lastName: string;

	@IsString()
	@IsOptional()
	middleName: string;

	@IsString()
	@IsNotEmpty({ message: 'Phone number is required' })
	phone: string;

	@IsEmail()
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@IsString()
	@MinLength(8)
	password: string;
}
