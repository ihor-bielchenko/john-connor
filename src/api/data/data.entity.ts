import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	Index,
	OneToMany,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';
import { State } from '../state/state.entity';

@Entity()
export class Data {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	@Index({ unique: true })
	public value: string;

	@OneToMany(() => Chain, (chain) => chain.data)
	public chains: Chain[];

	@OneToMany(() => State, (state) => state.data)
	public states: State[];
}
