import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { ulid } from 'ulidx';
import { BaseEntity } from '../../../shared/entities/base.entity';
import { Account } from '../../account/entities/account.entity';

@Entity()
export class User extends BaseEntity {
	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = `usr_${ulid()}`;
		}
	}

	@Column()
	firstName: string;

	@Column()
	lastName: string;

	@Column({ nullable: true })
	middleName: string;

	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	phone: string;

	@Column({ select: false })
	password: string;

	@OneToMany(
		() => Account,
		(account) => account.user,
	)
	accounts: Account[];
}
