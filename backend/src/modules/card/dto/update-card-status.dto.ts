import { IsEnum } from 'class-validator';
import { ECardStatus } from 'src/shared/enums/ECardStatus';

export class UpdateCardStatusDto {
	@IsEnum(ECardStatus)
	status: ECardStatus;
}
