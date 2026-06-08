import { ECardStatus } from 'src/shared/enums/ECardStatus';
import { ECardType } from 'src/shared/enums/ECardType';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { ulid } from 'ulidx';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Account } from '../../account/entities/account.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Card extends BaseEntity {
	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = `crd_${ulid()}`;
		}
	}

	@Column()
	name: string;

	@ManyToOne(() => User)
	user: User;

	@ManyToOne(() => Account, { eager: false })
	account: Account;

	@Column({ unique: true })
	cardNumber: string;

	@Column()
	expiryDate: string;

	@Column()
	cvv: string;

	@Column()
	pin: string;

	@Column()
	type: ECardType;

	@Column({ default: ECardStatus.Active })
	status: ECardStatus;
}
