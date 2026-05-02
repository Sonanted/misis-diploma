import { BeforeInsert, Column, Entity } from 'typeorm';
import { ulid } from 'ulidx';

import { BaseEntity } from '../../../common/entities/base.entity';

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

	@Column()
	password: string;
}
