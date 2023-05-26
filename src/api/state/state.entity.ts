import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Data } from '../data/data.entity';

@Entity()
export class State {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public prevId: number;

	@Column()
	public nextId: number;

	@Column({ default: 0 })
	public dataId: number;

	@ManyToOne(() => Data, (data) => data.states)
	public data: Data;

	@Column()
	public value: string;
}
