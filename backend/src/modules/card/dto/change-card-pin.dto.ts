import { IsString, Matches } from 'class-validator';

export class ChangeCardPinDto {
	@IsString()
	@Matches(/^\d{4}$/, { message: 'PIN должен состоять ровно из 4 цифр' })
	pin: string;
}
