import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	OneToMany,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';

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

	@Column('bool')
	isFortified: boolean;

	@OneToMany(() => Chain, (chain) => chain.neuron, {
		cascade: true,
	})
	public chains: Chain[];
}
