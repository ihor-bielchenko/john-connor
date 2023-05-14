import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	OneToMany,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';
import { ChainItem } from '../chain-item/chain-item.entity';

@Entity()
export class Neuron {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ default: 0 })
	public x: number;

	@Column({ default: 0 })
	public y: number;

	@OneToMany(() => Chain, (chain) => chain.neuron, {
		cascade: true,
	})
	public chains: Chain[];

	@OneToMany(() => ChainItem, (chainItem) => chainItem.neuron, {
		cascade: true,
	})
	public chainItems: ChainItem[];
}
