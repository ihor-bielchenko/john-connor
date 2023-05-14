import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';
import { Neuron } from '../neuron/neuron.entity';

@Entity()
export class ChainItem {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public chainId: number;

	@ManyToOne(() => Chain, (chain) => chain.chainItems, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public chain: Chain;

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
