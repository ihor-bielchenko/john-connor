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
	private newChain: Array<number> = [];

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

	getCurrentChain(): Array<number> {
		return this.chain;
	}

	pushCurrentChain(chainId: number): number {
		return this.chain.push(chainId);
	}

	clearCurrentChain(): any {
		return (this.chain = []);
	}

	getNewChain(): Array<number> {
		return this.newChain;
	}

	pushNewChain(chainId: number): number {
		return this.newChain.push(chainId);
	}

	clearNewChain(): any {
		return (this.newChain = []);
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
		const value = chain.join('-');

		return (defaultStateId > 0)
			? (((await this.stateRepository.findOne({ 
				relations: {
					stateItems: true,
				},
				where: { 
					id: defaultStateId,
					stateItems: {
						value,
					},
				}, 
			})) || {})['id']
				|| (await this.stateItemRepository.save({ 
					value,
					stateId: (await this.stateRepository.save({ id: null }))['id']
				}))['stateId'])
			: (await this.stateItemRepository.save({ 
				value,
				stateId: (await this.stateRepository.save({ id: null }))['id']
			}))['stateId'];
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

		console.log('0000', {
			nowNeuronId,
			nowStateId,
			value,
		});
		console.log('1111', chainTrue);

		if (chainTrue) {
			return {
				chainId: chainTrue['id'],
				stateId: chainTrue['stateId'],
				neuronId: chainTrue['neuronId'],
				value,
			};
		}
		let chainFalse = await this.chainRepository.findOne({
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

		console.log('2222', chainFalse);

		if (chainFalse) {
			return {
				chainId: chainFalse['id'],
				stateId: chainFalse['stateId'],
				neuronId: chainFalse['neuronId'],
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
				id: 'DESC',
			},
		});

		console.log('3333', chainFalseItems);

		if (chainFalseItems.length === 0) {
			chainFalseItems = await this.chainRepository.find({
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
				order: {
					id: 'ASC',
				},
			});
		}
		chainFalse = (chainFalseItems || [])[(chainFalseItems || []).length - 1];

		console.log('4444', chainFalse);

		if (!chainFalse) {
			chainFalse = await this.chainRepository.findOne({
				relations: {
					data: true,
				},
				where: {
					parentId: nowNeuronId,
					isFortified: true,
					isTrue: false,
					data: {
						value,
					},
				},
			});
		}
		const chainFalseClear = await this.chainRepository.findOne({
			where: {
				parentId: nowNeuronId,
				isTrue: false,
			},
		});

		console.log('5555', chainFalse);

		if (!chainFalse
			&& chainFalseClear['isFortified'] === false
			&& nowNeuronId !== 1 
			&& nowNeuronId !== 2) {
			const dataId = await this.getDataIdByValue(value);
			const points = (await this.getFreePoints(nowNeuronId))[0];
			const newNeuronId = (await this.repository.save({ x: points['x'], y: points['y'] }))['id'];

			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: nowNeuronId,
				neuronId: chainFalseClear['neuronId'],
				dataId,
				isTrue: true,
				isFortified: true,
			}))['id']);
			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: nowNeuronId,
				neuronId: newNeuronId,
				dataId,
				isTrue: true,
				isFortified: false,
			}))['id']);
			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: newNeuronId,
				neuronId: chainFalseClear['neuronId'],
				dataId,
				isTrue: true,
				isFortified: true,
			}))['id']);
			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: newNeuronId,
				neuronId: nowNeuronId,
				dataId,
				isTrue: false,
				isFortified: false,
			}))['id']);
			await this.chainRepository.save({ id: chainFalseClear['id'], isFortified: true });

			return {
				chainId: chainFalseClear['id'],
				neuronId: chainFalseClear['neuronId'],
				stateId: nowStateId,
				value,
				isReturn: true,
			};
		}
		const currentChain = this.getCurrentChain();

		console.log('6666', chainFalse);
		console.log('7777', chainFalseClear);
		console.log('8888', this.getCurrentChain().includes(chainFalseClear['neuronId']));

		if (currentChain.includes(chainFalseClear['neuronId'])) {
			const dataId = await this.getDataIdByValue(value);
			const points = (await this.getFreePoints(nowNeuronId))[0];
			const newNeuronId = (await this.repository.save({ x: points['x'], y: points['y'] }))['id'];

			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: nowNeuronId,
				neuronId: newNeuronId,
				dataId,
				isTrue: true,
				isFortified: true,
			}))['id']);
			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: nowNeuronId,
				neuronId: currentChain[currentChain.length - 1],
				dataId,
				isTrue: false,
				isFortified: false,
			}))['id']);
			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: newNeuronId,
				neuronId: nowNeuronId,
				dataId,
				isTrue: true,
				isFortified: true,
			}))['id']);
			this.pushNewChain((await this.chainRepository.save({
				stateId: nowStateId,
				parentId: newNeuronId,
				neuronId: chainFalseClear['neuronId'],
				dataId,
				isTrue: false,
				isFortified: false,
			}))['id']);

			return {
				chainId: chainFalseClear['id'],
				neuronId: chainFalseClear['neuronId'],
				stateId: nowStateId,
				value,
				isReturn: true,
			};
		}
		return {
			chainId: chainFalseClear['id'],
			neuronId: chainFalseClear['neuronId'],
			stateId: nowStateId,
			value,
		};
	}

	async pass(neuronId: number, stateId: number, value: string = ''): Promise<Array<number>> {
		const currentChain = this.getCurrentChain();
		const nextNeuron = await this.getNextNeuron(neuronId, stateId, value);

		this.pushCurrentChain(neuronId);

		if (nextNeuron.isReturn) {
			if (!currentChain.includes(nextNeuron.neuronId)) {
				this.pushCurrentChain(nextNeuron.neuronId);
			}
			return this.getCurrentChain();
		}
		if (!currentChain.includes(nextNeuron.neuronId)) {
			return await this.pass(nextNeuron.neuronId, nextNeuron.stateId, value);
		}
		return this.getCurrentChain();
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
		console.log('????????????????????????????????????????????????');

		const readChain = await this.pass(1, nowStateId, value);
		const chainReadItem = await this.stateRepository.findOne({
			relations: {
				chains: {
					data: true,
				},
				stateItems: true,
			},
			where: {
				stateItems: {
					value: readChain.join('-'),
				},
			},
		});
		let nextStateId = chainReadItem
			? chainReadItem['id']
			: await this.createState(readChain),
			i = 0;

		while (i < this.newChain.length) {
			await this.chainRepository.save({ id: this.newChain[i], stateId: nextStateId });
			i++;
		}
		const newChain = [ ...this.getNewChain() ];

		this.clearNewChain();
		this.clearCurrentChain();

		const newValue = ((((chainReadItem || {})['chains'] || [])[0] || {})['data'] || {})['value'] ?? value;

		console.log('===================================');

		const executeChain = await this.pass(2, nextStateId, newValue);
		const chainExecuteItem = await this.stateRepository.findOne({
			relations: {
				chains: {
					data: true,
				},
				stateItems: true,
			},
			where: {
				stateItems: {
					value: executeChain.join('-'),
				},
			},
		});

		if (chainExecuteItem) {
			nextStateId = chainExecuteItem['id'];
		}
		else {
			nextStateId = await this.createState(executeChain, nextStateId);
		}
		i = 0;

		while (i < newChain.length) {
			const id = newChain[i];
			const chainModel = { ...(await this.chainRepository.findOne({ where: { id } }) || {}) };

			delete chainModel['id'];
			await this.chainRepository.save({ ...chainModel, stateId: nextStateId });
			i++;
		}
		this.clearNewChain();
		this.clearCurrentChain();

		return {
			readChain,
			executeChain,
			stateId: nextStateId,
			value: chainExecuteItem
				? chainExecuteItem
					.chains[0]
					.data
					.value
				: (_prevResult = await this.execute(newValue)),
		};
		return {};
	}
}
