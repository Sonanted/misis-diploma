import { EAccountCurrency } from 'src/shared/enums/EAccountCurrency';
import { EAccountStatus } from 'src/shared/enums/EAccountStatus';
import { EAccountType } from 'src/shared/enums/EAccountType';
import { BeforeInsert, Column, Entity, ManyToOne } from 'typeorm';
import { ulid } from 'ulidx';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Account extends BaseEntity {
	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = `usr_${ulid()}`;
		}
	}

	@Column()
	name: string;

	@ManyToOne(
		() => User,
		(user) => user.accounts,
	)
	user: User;

	@Column()
	accountNumber: string;

	@Column()
	type: EAccountType;

	@Column()
	status: EAccountStatus;

	@Column()
	balance: number;

	@Column()
	currency: EAccountCurrency;

	@Column({ nullable: true })
	interestRate: number;
}
