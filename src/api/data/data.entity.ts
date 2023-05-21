import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	Index,
	OneToMany,
} from 'typeorm';
import { StateItem } from '../state-item/state-item.entity';

@Entity()
export class Data {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	@Index({ unique: true })
	public value: string;

	@OneToMany(() => StateItem, (stateItem) => stateItem.data, {
		cascade: true,
	})
	public stateItems: StateItem[];
}
