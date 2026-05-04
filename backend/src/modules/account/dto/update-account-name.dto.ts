import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountNameDto extends PartialType(CreateAccountDto) {
	@IsString()
	name: string;
}
