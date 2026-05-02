import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignupDto {
	@IsString()
	@IsNotEmpty()
	firstName: string;

	@IsString()
	@IsNotEmpty()
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
	@IsNotEmpty({ message: 'Password is required' })
	password: string;
}
