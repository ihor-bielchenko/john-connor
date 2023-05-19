import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Neuron } from '../neuron/neuron.entity';
import { Data } from '../data/data.entity';
import { State } from '../state/state.entity';

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
	public dataId: number;

	@ManyToOne(() => Data, (data) => data.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public data: Data;

	@Column()
	public stateId: number;

	@ManyToOne(() => State, (state) => state.chains, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public state: State;

	@Column('bool')
	isTrue: boolean;
}
