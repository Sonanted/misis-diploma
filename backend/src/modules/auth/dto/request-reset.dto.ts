import { IsNotEmpty, IsString } from 'class-validator';

export class RequestResetDto {
	@IsString()
	@IsNotEmpty()
	phone: string;
}
