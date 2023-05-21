import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	Index,
	OneToMany,
} from 'typeorm';
import { State } from '../state/state.entity';

@Entity()
export class Data {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	@Index({ unique: true })
	public value: string;

	@OneToMany(() => State, (state) => state.data, {
		cascade: true,
	})
	public states: State[];
}
