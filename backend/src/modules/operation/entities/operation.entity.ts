import { EOperationType } from 'src/shared/enums/EOperationType';
import { BeforeInsert, Column, Entity } from 'typeorm';
import { ulid } from 'ulidx';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('operation')
export class Operation extends BaseEntity {
	@BeforeInsert()
	generateId() {
		if (!this.id) {
			this.id = `op_${ulid()}`;
		}
	}

	@Column()
	type: EOperationType;

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
	amount: number | null;

	@Column({ nullable: true })
	fromAccountId: string | null;

	@Column({ nullable: true })
	fromAccountNumber: string | null;

	@Column({ nullable: true })
	toAccountId: string | null;

	@Column({ nullable: true })
	toAccountNumber: string | null;

	// For card-initiated transfers and card lifecycle events
	@Column({ nullable: true })
	relatedCardId: string | null;

	// For card lifecycle events: the account the card belongs to
	@Column({ nullable: true })
	relatedAccountId: string | null;

	@Column()
	userId: string;

	@Column({ nullable: true })
	description: string | null;
}
