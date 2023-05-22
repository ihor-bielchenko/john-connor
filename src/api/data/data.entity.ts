import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	Index,
	OneToMany,
} from 'typeorm';
import { Chain } from '../chain/chain.entity';

@Entity()
export class Data {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	@Index({ unique: true })
	public value: string;

	@OneToMany(() => Chain, (chain) => chain.data, {
		cascade: true,
	})
	public chains: Chain[];
}
