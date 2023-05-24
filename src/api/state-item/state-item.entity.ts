import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { State } from '../state/state.entity';

@Entity()
export class StateItem {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public stateId: number;

	@ManyToOne(() => State, (state) => state.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public state: State;

	@Column({ default: '' })
	public value: string;
}
