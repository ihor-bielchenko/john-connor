import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	OneToMany,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';
import { State } from '../state/state.entity';

@Entity()
export class Neuron {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({ default: '' })
	public name: string;

	@Column({ default: 0 })
	public x: number;

	@Column({ default: 0 })
	public y: number;

	@OneToMany(() => Chain, (chain) => chain.neuron, {
		cascade: true,
	})
	public chains: Chain[];

	@OneToMany(() => State, (state) => state.neuron, {
		cascade: true,
	})
	public states: State[];
}
