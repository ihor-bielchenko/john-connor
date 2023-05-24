import { 
	PrimaryGeneratedColumn,
	Entity, 
	Column,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { Neuron } from '../neuron/neuron.entity';

@Entity()
export class State {
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public neuronId: number;

	@ManyToOne(() => Neuron, (neuron) => neuron.states, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public neuron: Neuron;

	@Column()
	public value: string;

	@Column({ default: 0 })
	public used: number;
}
