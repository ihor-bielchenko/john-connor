const { exec } = require('child_process');

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
import { StateItem } from '../state-item/state-item.entity';
import { Data } from '../data/data.entity';

const intervals = {};
let _prevResult = '';

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
		@InjectRepository(StateItem) protected readonly stateItemRepository: Repository<StateItem>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			name: true,
			x: true,
			y: true,
		});
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
			name: true,
			x: true,
			y: true,
		});
	}

	protected manyGetQueryColumns(customColumns: object = {}) {
		return ({
			name: true,
		});
	}

	currentChain(): Array<number> {
		return this.chain;
	}

	pushChain(chainId: number): number {
		return this.chain.push(chainId);
	}

	clearChain(): any {
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
			x: x + 60,
			y: y,
		}, {
			x: x - 60,
			y: y,
		}, {
			x: x,
			y: y + 60,
		}, {
			x: x,
			y: y - 60,
		}, {
			x: x + 30,
			y: y + 60,
		}, {
			x: x - 30,
			y: y + 60,
		}, {
			x: x + 30,
			y: y - 60,
		}, {
			x: x - 30,
			y: y - 60,
		}, {
			x: x + 60,
			y: y + 60,
		}, {
			x: x - 60,
			y: y + 60,
		}, {
			x: x + 60,
			y: y - 60,
		}, {
			x: x - 60,
			y: y - 60,
		}, {
			x: x + 30,
			y: y,
		}, {
			x: x - 30,
			y: y,
		}, {
			x: x - Math.floor(Math.random() * (59 - 21 + 1) + 31),
			y: y - Math.floor(Math.random() * (59 - 21 + 1) + 31),
		}, {
			x: x - Math.floor(Math.random() * (89 - 61 + 1) + 61),
			y: y - Math.floor(Math.random() * (89 - 61 + 1) + 61),
		}, {
			x: x - Math.floor(Math.random() * (119 - 91 + 1) + 91),
			y: y - Math.floor(Math.random() * (119 - 91 + 1) + 91),
		}, {
			x: x - Math.floor(Math.random() * (149 - 121 + 1) + 121),
			y: y - Math.floor(Math.random() * (149 - 121 + 1) + 121),
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

	async createState(chain: Array<number>, defaultStateId: number = 0): Promise<number> {
		const stateId = (defaultStateId > 0)
			? (((await this.stateRepository.findOne({ where: { id: defaultStateId } })) || {})['id']
				|| (await this.stateRepository.save({ id: null }))['id'])
			: (await this.stateRepository.save({ id: null }))['id'];
		let i = 0;

		while (i < chain.length) {
			await this.stateItemRepository.save({
				stateId,
				neuronId: chain[i],
				order: i,
			});
			i++;
		}
		return stateId;
	}

	async getNextNeuron(nowNeuronId: number, nowStateId: number, value: string = ''): Promise<any> {
		const chainTrue = await this.chainRepository.findOne({
			relations: {
				data: true,
			},
			where: {
				parentId: nowNeuronId,
				stateId: nowStateId,
				isTrue: true,
				data: {
					value,
				},
			},
		});

		if (chainTrue) {
			return {
				chainId: chainTrue['id'],
				stateId: chainTrue['stateId'],
				neuronId: chainTrue['neuronId'],
				value,
			};
		}
		const chainFalseWithState = await this.chainRepository.findOne({
			relations: {
				data: true,
			},
			where: {
				parentId: nowNeuronId,
				stateId: nowStateId,
				isTrue: false,
				data: {
					value,
				},
			},
		});

		if (chainFalseWithState) {
			return {
				chainId: chainFalseWithState['id'],
				neuronId: chainFalseWithState['neuronId'],
				stateId: chainFalseWithState['stateId'],
				value,
			};
		}
		const chainFalseWithValue = await this.chainRepository.findOne({
			relations: {
				data: true,
			},
			where: {
				parentId: nowNeuronId,
				isTrue: false,
				data: {
					value,
				},
			},
		});

		if (chainFalseWithValue && nowNeuronId !== 1) {
			return {
				chainId: chainFalseWithValue['id'],
				neuronId: chainFalseWithValue['neuronId'],
				stateId: chainFalseWithValue['stateId'],
				value,
			};
		}
		let chainFalseItems = await this.chainRepository.find({
			where: {
				parentId: nowNeuronId,
				stateId: nowStateId,
				isTrue: false,
				isFortified: false,
			},
			order: {
				id: 'ASC',
			},
		});

		if (chainFalseItems.length === 0) {
			chainFalseItems = await this.chainRepository.find({
				where: {
					parentId: nowNeuronId,
					isTrue: false,
					isFortified: false,
				},
				order: {
					id: 'DESC',
				},
			});
		}
		let chainFalse = (chainFalseItems || [])[(chainFalseItems || []).length - 1];

		if (chainFalse 
			&& !chainFalse['isFortified'] 
			&& nowNeuronId !== 1) {
			const dataId = await this.getDataIdByValue(value);
			const newStateId = await this.createState(this.currentChain(), nowStateId);
			const points = (await this.getFreePoints(nowNeuronId))[0];
			const newNeuronId = (await this.repository.save({ x: points['x'], y: points['y'] }))['id'];

			await this.chainRepository.save({
				stateId: newStateId,
				parentId: nowNeuronId,
				neuronId: chainFalse['neuronId'],
				dataId,
				isTrue: true,
				isFortified: true,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: nowNeuronId,
				neuronId: newNeuronId,
				dataId,
				isTrue: false,
				isFortified: false,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: newNeuronId,
				neuronId: chainFalse['neuronId'],
				dataId,
				isTrue: true,
				isFortified: true,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: newNeuronId,
				neuronId: nowNeuronId,
				dataId,
				isTrue: false,
				isFortified: false,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: chainFalse['neuronId'],
				neuronId: newNeuronId,
				dataId,
				isTrue: true,
				isFortified: true,
			});
			await this.chainRepository.save({
				stateId: newStateId,
				parentId: chainFalse['neuronId'],
				neuronId: nowNeuronId,
				dataId,
				isTrue: false,
				isFortified: true,
			});
			await this.chainRepository.save({ id: chainFalse['id'], isFortified: true });

			return {
				chainId: chainFalse['id'],
				neuronId: newNeuronId,
				stateId: newStateId,
				value,
			};
		}
		chainFalse = (await this.chainRepository.findOne({
			relations: {
				data: true,
			},
			where: {
				parentId: nowNeuronId,
				isTrue: false,
				isFortified: false,
				data: {
					value,
				},
			},
		})) || (await this.chainRepository.findOne({
			where: {
				parentId: nowNeuronId,
				isTrue: false,
			},
		}));

		return {
			chainId: chainFalse['id'],
			neuronId: chainFalse['neuronId'],
			stateId: chainFalse['stateId'],
			value,
		};
	}

	async pass(neuronId: number, stateId: number, value: string = ''): Promise<Array<number>> {
		const currentChain = this.currentChain();
		const nextNeuron = await this.getNextNeuron(neuronId, stateId, 'PWD');

		if (!currentChain.includes(nextNeuron.neuronId)) {
			this.pushChain(nextNeuron.neuronId);

			return await this.pass(nextNeuron.neuronId, nextNeuron.stateId, value);
		}
		return this.currentChain();
	}

	async execute(value: string = ''): Promise<string> {
		return await (new Promise((resolve, reject) => {
			exec(value, (error, stdout, stderr) => {
				if (error) {
					return resolve(error.message);
				}
				if (stderr) {
					return resolve(stderr);
				}
				return resolve(stdout);
			});
		}));
	}

	async step(nowStateId: number, value: string = ''): Promise<any> {
		const readChain = await this.pass(1, nowStateId, value);
		const chainReadItem = await this.stateItemRepository.find({
			relations: {
				state: {
					chains: {
						data: true,
					},
				},
			},
			where: readChain.map((neuronId, order) => ({
				neuronId,
				order,
				state: {
					chains: {
						data: {
							value,
						},
					},
				},
			})),
			order: {
				order: 'ASC',
			}
		});
		const nextStateId = (chainReadItem.length === readChain.length)
			? chainReadItem[0]['stateId']
			: await this.createState(readChain);

		this.clearChain();

		const executeChain = await this.pass(2, nextStateId, value);
		const newValue = _prevResult = await this.execute(value);
		const chainExecuteItems = await this.stateItemRepository.find({
			relations: {
				state: {
					chains: {
						data: true,
					},
				},
			},
			where: executeChain.map((neuronId, order) => ({
				stateId: nextStateId,
				neuronId,
				order,
			})),
			order: {
				order: 'ASC',
			},
		});

		this.clearChain();

		return {
			readChain,
			executeChain,
			stateId: nextStateId,
			value: (chainExecuteItems.length === executeChain.length
				&& chainExecuteItems[0]['state']['chains'].length > 0)
				? chainExecuteItems[0]['state']['chains'][0]['data']['value']
				: newValue,
		};
		return {};
	}
}
