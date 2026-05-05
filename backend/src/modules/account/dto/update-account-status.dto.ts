import { IsEnum } from 'class-validator';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';

export class UpdateAccountStatusDto {
	@IsEnum(EAccountStatus)
	status: EAccountStatus;
}
