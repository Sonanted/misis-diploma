import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
	@IsString()
	@MinLength(2)
	@IsOptional()
	firstName?: string;

	@IsString()
	@MinLength(2)
	@IsOptional()
	lastName?: string;

	@IsString()
	@IsOptional()
	middleName?: string;

	@IsEmail()
	@IsOptional()
	email?: string;

	@IsString()
	@IsOptional()
	phone?: string;
}
