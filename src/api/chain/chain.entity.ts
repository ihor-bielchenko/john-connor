import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Neuron } from '../neuron/neuron.entity';
import { Data } from '../data/data.entity';
import { ChainItem } from '../chain-item/chain-item.entity';

@Entity()
export class Chain {
	@PrimaryGeneratedColumn()
	public id: number;

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

	@Column({ default: '' })
	public name: string;

	@OneToMany(() => ChainItem, (chainItem) => chainItem.chain, {
		cascade: true,
	})
	public chainItems: ChainItem[];
}
