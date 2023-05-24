import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Neuron } from '../neuron/neuron.entity';
import { Data } from '../data/data.entity';

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

	@Column({ default: 0 })
	public dataId: number;

	@ManyToOne(() => Data, (data) => data.chains)
	public data: Data;

	@Column('bool')
	isTrue: boolean;

	@Column('bool')
	isSaved: boolean;
}
