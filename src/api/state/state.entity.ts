import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';

@Entity()
export class State {
	@PrimaryGeneratedColumn()
	public id: number;

	@OneToMany(() => Chain, (chain) => chain.state, {
		cascade: true,
	})
	public chains: Chain[];
}
