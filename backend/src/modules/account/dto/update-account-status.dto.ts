import { PartialType } from '@nestjs/mapped-types';
import { IsEnum } from 'class-validator';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountStatusDto extends PartialType(CreateAccountDto) {
	@IsEnum(EAccountStatus)
	status: EAccountStatus;
}
