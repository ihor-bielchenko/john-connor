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

@Injectable()
export class NeuronService extends SqlService {
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly withEnvKey: boolean = false;
	protected readonly repositoryConstructor = Neuron;

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

	async getNextNeuron(nowNeuronId: number, neuronId: number, value: string = ''): Promise<any> {
		const chainTrue = await this.chainRepository.findOne({
			relations: {
				data: true,
			},
			where: {
				parentId: nowNeuronId,
				isTrue: true,
				data: {
					value,
				},
			},
		});

		if (chainTrue) {
			return {
				chainId: chainTrue['id'],
				neuronId: chainTrue['neuronId'],
				value: chainTrue['data']['value'],
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

		if (chainFalseWithValue) {
			return {
				chainId: chainFalseWithValue['id'],
				neuronId: chainFalseWithValue['neuronId'],
				value,
			};
		}
		const chainFalseItems = await this.chainRepository.find({
			relations: {
				data: true,
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
			const dataId = ((await this.dataRepository.findOne({
				where: {
					value,
				},
			})) || {})['id'] ?? (await this.dataRepository.save({ value }))['id'];
			const points = (await this.getFreePoints(nowNeuronId))[0];
			const newNeuronId = (await this.repository.save({ x: points['x'], y: points['y'], isFortified: false }))['id'];

			await this.chainRepository.save({
				parentId: nowNeuronId,
				neuronId: chainFalse['neuronId'],
				isTrue: true,
				dataId,
			});
			await this.chainRepository.save({
				parentId: nowNeuronId,
				neuronId: newNeuronId,
				isTrue: false,
				dataId,
			});
			await this.chainRepository.save({
				parentId: newNeuronId,
				neuronId: chainFalse['neuronId'],
				isTrue: true,
				dataId,
			});
			await this.chainRepository.save({
				parentId: newNeuronId,
				neuronId: nowNeuronId,
				isTrue: false,
				dataId,
			});
			await this.chainRepository.save({
				parentId: chainFalse['neuronId'],
				neuronId: newNeuronId,
				isTrue: true,
				dataId,
			});
			await this.chainRepository.save({
				parentId: chainFalse['neuronId'],
				neuronId: nowNeuronId,
				isTrue: false,
				dataId,
			});
			await this.repository.save({ id: chainFalse['parentId'], isFortified: true });

			return {
				chainId: chainFalse['id'],
				neuronId: newNeuronId,
				value,
			};
		}
		return {
			chainId: chainFalse['id'],
			neuronId: chainFalse['neuronId'],
			value,
		};
	}

	async pass(neuronId: number, stateId: number, value: string = '', path = []): Promise<Array<number>> {
		const nextNeuron = await this.getNextNeuron(neuronId, stateId, value);

		if (!path.includes(nextNeuron.chainId)) {
			path.push(nextNeuron.chainId);

			return await this.pass(nextNeuron.neuronId, nextNeuron.value, path);
		}
		return path;
	}

	async step(stateId: number, value: string = ''): Promise<any> {
		const pathRead = this.pass(1, stateId, value);
		const stateReadItems = await this.stateRepository.find({
			relations: {
				data: true,
			},
			where: pathRead.map((chainId, order) => ({
				parentId: stateId,
				chainId,
				order,
				data: {
					value,
				},
			})),
			order: {
				order: 'ASC',
			},
		});
		
		if (stateReadItems.length === pathRead.length) {
			stateId = stateReadItems[0]['parentId'];
		}
		else {
			let i = 0;

			while (i < pathRead.length) {
				await this.stateRepository.save({
					parentId: stateId,
					chainId: pathRead[i],
					order: i,
					dataId: ((await this.dataRepository.findOne({
						where: {
							value,
						},
					})) || {})['id'] ?? (await this.dataRepository.save({ value }))['id'],
				});
				i++;
			}
		}
		const pathExecute = this.pass(2, stateId, value);
		const stateExecuteItems = await this.stateRepository.find({
			relations: {
				data: true,
			},
			where: pathExecute.map((chainId, order) => ({
				parentId: stateId,
				chainId,
				order,
			})),
		});

		if (stateExecuteItems.length === pathExecute.length) {
			return {
				value: stateExecuteItems[0]['data']['value'],
				stateId,
			};
		}
		else {
			let i = 0;

			while (i < pathExecute.length) {
				await this.stateRepository.save({
					parentId: stateId,
					chainId: pathExecute[i],
					order: i,
					dataId: ((await this.dataRepository.findOne({
						where: {
							value,
						},
					})) || {})['id'] ?? (await this.dataRepository.save({ value }))['id'],
				});
				i++;
			}
		}
		return {
			value,
			stateId,
		};
	}
}
