import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Neuron } from '../neuron/neuron.entity';
import { Chain } from '../chain/chain.entity';
import { Data } from '../data/data.entity';

@Entity()
export class State {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public parentId: number;

	@Column()
	public neuronId: number;

	@ManyToOne(() => Neuron, (neuron) => neuron.states, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public neuron: Neuron;

	@Column()
	public dataId: number;

	@ManyToOne(() => Data, (data) => data.states, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public data: Data;

	@OneToMany(() => Chain, (chain) => chain.state, {
		cascade: true,
	})
	public chains: Chain[];
}
