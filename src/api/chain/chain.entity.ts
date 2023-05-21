import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Neuron } from '../neuron/neuron.entity';
import { State } from '../state/state.entity';
import { StateItem } from '../state-item/state-item.entity';

@Entity()
export class Chain {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public parentId: number;

	@ManyToOne(() => Neuron, (parent) => parent.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public parent: Neuron;

	@Column()
	public neuronId: number;

	@ManyToOne(() => Neuron, (neuron) => neuron.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public neuron: Neuron;

	@Column()
	public stateId: number;

	@ManyToOne(() => State, (state) => state.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public state: State;

	@Column('bool')
	isTrue: boolean;

	@OneToMany(() => StateItem, (stateItem) => stateItem.chain, {
		cascade: true,
	})
	public stateItems: StateItem[];
}
