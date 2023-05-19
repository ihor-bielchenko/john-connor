import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
	In,
	Not,
} from 'typeorm';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import { Neuron } from './neuron.entity';
import { Chain } from '../chain/chain.entity';
import { State } from '../state/state.entity';
import { Data } from '../data/data.entity';

const intervals = {};
let _value = '';

@Injectable()
export class NeuronService extends SqlService {
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly withEnvKey: boolean = false;
	protected readonly repositoryConstructor = Neuron;
	private chain: Array<number> = [];

	constructor(
		@InjectRepository(Neuron) protected readonly repository: Repository<Neuron>,
		@InjectRepository(Chain) protected readonly chainRepository: Repository<Chain>,
		@InjectRepository(Data) protected readonly dataRepository: Repository<Data>,
		@InjectRepository(State) protected readonly stateRepository: Repository<State>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}

	currentChain(): Promise<Array<number>> {
		return this.chain;
	}

	pushChain(chainId: number): Promise<number> {
		return this.chain.push(chainId);
	}

	clearChain(chainId: number): Promise<any> {
		return (this.chain = []);
	}

	async getFreePoints(id: number): Promise<Array<number>> {
		const parentNeuronItem = (await this.repository.findOne({
			where: {
				id,
			},
		})) || {};
		const x = parentNeuronItem['x'] ?? 0;
		const y = parentNeuronItem['y'] ?? 0;
		const output: any = [{
			x: x + 5,
			y: y,
		}, {
			x: x - 5,
			y: y,
		}, {
			x: x,
			y: y + 10,
		}, {
			x: x,
			y: y - 10,
		}, {
			x: x + 5,
			y: y + 10,
		}, {
			x: x - 5,
			y: y + 10,
		}, {
			x: x + 5,
			y: y - 10,
		}, {
			x: x - 5,
			y: y - 10,
		}, {
			x: x + 10,
			y: y,
		}, {
			x: x - 10,
			y: y,
		}, {
			x: x + 10,
			y: y + 10,
		}, {
			x: x - 10,
			y: y + 10,
		}, {
			x: x + 10,
			y: y - 10,
		}, {
			x: x - 10,
			y: y - 10,
		}, {
			x: x - Math.floor(Math.random() * (14 - 11 + 1) + 11),
			y: y - Math.floor(Math.random() * (14 - 11 + 1) + 11),
		}, {
			x: x - Math.floor(Math.random() * (19 - 16 + 1) + 16),
			y: y - Math.floor(Math.random() * (19 - 16 + 1) + 16),
		}, {
			x: x - Math.floor(Math.random() * (24 - 21 + 1) + 21),
			y: y - Math.floor(Math.random() * (24 - 21 + 1) + 21),
		}, {
			x: x - Math.floor(Math.random() * (29 - 26 + 1) + 26),
			y: y - Math.floor(Math.random() * (29 - 26 + 1) + 26),
		}];
		const neuronItems = await this.repository.find({ where: output });

		return output.filter((pointItem) => !neuronItems.find((neuronItem) => neuronItem['x'] === pointItem['x'] && neuronItem['y'] === pointItem['y']));
	}

	async getDataIdByValue(value: string = ''): Promise<number> {
		return ((await this.dataRepository.findOne({
			where: {
				value,
			},
		})) || {})['id'] ?? (await this.dataRepository.save({ value }))['id'];
	}

	async createState(value: string = '', defaultStateId: number): Promise<number> {
		const dataId = await getDataIdByValue(value);
		const stateId = defaultStateId
			? (((await this.stateRepository.findOne({ id: defaultStateId })) || {})['id']
				|| await this.stateRepository.save())
			: await this.stateRepository.save();
		let i = 0,
			chain = this.currentChain();

		while (i < chain.length) {
			await this.stateItemsRepository.save({
				parentId: stateId,
				chainId: chain[i],
				dataId,
				order: i,
			});
			i++;
		}
		return stateId;
	}

	async getNextNeuron(nowNeuronId: number, nowStateId: number, value: string = ''): Promise<any> {
		const chainTrue = await this.chainRepository.findOne({
			relations: {
				state: {
					stateItems: {
						data: true,
					},
				},
			},
			where: {
				parentId: nowNeuronId,
				stateId: nowStateId,
				isTrue: true,
				state: {
					stateItems: {
						data: {
							value,
						},
					},
				},
			},
		});

		if (chainTrue) {
			return {
				stateId: nowStateId,
				chainId: chainTrue['id'],
				neuronId: chainTrue['neuronId'],
				value,
			};
		}
		const chainFalseWithValue = await this.chainRepository.findOne({
			relations: {
				state: {
					stateItems: {
						data: true,
					},
				},
			},
			where: {
				parentId: nowNeuronId,
				stateId: nowStateId,
				isTrue: false,
				state: {
					stateItems: {
						data: {
							value,
						},
					},
				},
			},
		});

		if (chainFalseWithValue) {
			return {
				chainId: chainFalseWithValue['id'],
				neuronId: chainFalseWithValue['neuronId'],
				stateId: nowStateId,
				value,
			};
		}
		const chainFalseItems = await this.chainRepository.find({
			relations: {
				parent: true,
			},
			where: {
				parentId: nowNeuronId,
				isTrue: false,
			},
			order: {
				id: 'ASC',
			},
		});
		const chainFalse = chainFalseItems[chainFalseItems.length - 1];

		if (!chainFalse['parent']['isFortified'] && nowNeuronId !== 1) {
			const newStateId = await this.createState(value, stateId);
			const points = (await this.getFreePoints(nowNeuronId))[0];
			const newNeuronId = (await this.repository.save({ x: points['x'], y: points['y'], isFortified: false }))['id'];

			await this.chainRepository.save({
				stateId: newStateId,
				parentId: nowNeuronId,
				neuronId: chainFalse['neuronId'],
				isTrue: true,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: nowNeuronId,
				neuronId: newNeuronId,
				isTrue: false,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: newNeuronId,
				neuronId: chainFalse['neuronId'],
				isTrue: true,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: newNeuronId,
				neuronId: nowNeuronId,
				isTrue: false,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: chainFalse['neuronId'],
				neuronId: newNeuronId,
				isTrue: true,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: chainFalse['neuronId'],
				neuronId: nowNeuronId,
				isTrue: false,
			});
			await this.repository.save({ id: chainFalse['parentId'], isFortified: true });

			return {
				chainId: chainFalse['id'],
				neuronId: newNeuronId,
				stateId: newStateId,
				value,
			};
		}
		return {
			chainId: chainFalse['id'],
			neuronId: chainFalse['neuronId'],
			stateId: chainFalse['stateId'],
			value,
		};
	}

	async pass(neuronId: number, stateId: number, value: string = ''): Promise<Array<number>> {
		const nextNeuron = await this.getNextNeuron(neuronId, stateId, value);

		if (!this.currentChain().includes(nextNeuron.chainId)) {
			this.pushChain(nextNeuron.chainId);

			return await this.pass(nextNeuron.neuronId, stateId, nextNeuron.value);
		}
		return this.currentChain();
	}

	async execute(value: string = ''): Promise<string> {
		return '';
	}

	async step(nowStateId: number, value: string = ''): Promise<any> {
		const readChain = this.pass(1, nowStateId, value);
		const stateReadItems = await this.stateItemsRepository.find({
			relations: {
				state: {
					data: true,
				},
			},
			where: readChain.map((chainId, order) => ({
				chainId,
				order,
				state: {
					data: {
						value,
					},
				},
			})),
			order: {
				order: 'ASC',
			},
		});
		const nextStateId = (stateReadItems.length === readChain.length)
			? stateReadItems[0]['parentId']
			: await this.createState(value);

		this.clearChain();

		const executeChain = this.pass(2, nextStateId, value);
		const newValue = _value = await this.execute(value);
		const stateExecuteItems = await this.stateItemsRepository.find({
			relations: {
				state: {
					data: true,
				},
			},
			where: executeChain.map((chainId, order) => ({
				parentId: nextStateId,
				chainId,
				order,
			})),
			order: {
				order: 'ASC',
			},
		});

		return (stateExecuteItems.length === executeChain.length)
			? ({
				stateId: nextStateId,
				value: stateExecuteItems[0]['state']['data']['value'],
			})
			: ({
				stateId: nextStateId,
				value: newValue,
			});
	}
}
