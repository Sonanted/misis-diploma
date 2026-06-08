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

	@Column({
		type: 'decimal',
		precision: 15,
		scale: 2,
		default: 0,
		transformer: {
			to: (value: number) => value,
			from: (value: string) => parseFloat(value),
		},
	})
	balance: number;

	@Column()
	currency: EAccountCurrency;

	@Column({ nullable: true })
	interestRate: number;

	@Column({
		type: 'decimal',
		precision: 15,
		scale: 2,
		nullable: true,
		transformer: {
			to: (value: number | null) => value,
			from: (value: string | null) => (value !== null ? parseFloat(value) : null),
		},
	})
	creditLimit: number | null;
}
