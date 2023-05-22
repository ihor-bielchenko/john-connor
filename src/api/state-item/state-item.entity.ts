import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { State } from '../state/state.entity';
import { Neuron } from '../neuron/neuron.entity';

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

	@Column()
	public neuronId: number;

	@ManyToOne(() => Neuron, (neuron) => neuron.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public neuron: Neuron;

	@Column({ default: 0 })
	public order: number;
}
