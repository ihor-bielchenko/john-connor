const { exec } = require('child_process');

import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
	Not,
} from 'typeorm';
import { str as utilsCheckStr } from '@nest-datum-utils/check';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import { Neuron } from './neuron.entity';
import { Chain } from '../chain/chain.entity';
import { State } from '../state/state.entity';
import { Data } from '../data/data.entity';

let _prevNeuronId,
	_prevChain;

@Injectable()
export class NeuronService extends SqlService {
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly withEnvKey: boolean = false;
	protected readonly repositoryConstructor = Neuron;
	private chain: Array<number> = [];

	constructor(
		@InjectRepository(Neuron) protected readonly repository: Repository<Neuron>,
		@InjectRepository(Chain) protected readonly chainRepository: Repository<Chain>,
		@InjectRepository(State) protected readonly stateRepository: Repository<State>,
		@InjectRepository(Data) protected readonly dataRepository: Repository<Data>,
		@InjectRedis('State') protected readonly stateRedis: Redis,
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

	async getFreePoints(id: number): Promise<Array<number>> {
		const parentNeuronItem = (await this.repository.findOne({
			where: {
				id,
			},
		})) || {};
		const x = parentNeuronItem['x'] ?? 0;
		const y = parentNeuronItem['y'] ?? 0;
		const output: any = [{
			x: x,
			y: y + 60,
		}, {
			x: x - 60,
			y: y,
		}, {
			x: x + 60,
			y: y,
		}, {
			x: x,
			y: y - 60,
		}];
		const neuronItems = await this.repository.find({ where: output });

		return output.filter((pointItem) => !neuronItems.find((neuronItem) => neuronItem['x'] === pointItem['x'] && neuronItem['y'] === pointItem['y']));
	}

	async getRedisVarString(value: string = ''): Promise<string> {
		let varName = '${VAR',
			redisIndex = '';
		const varIndex = value.indexOf(varName);

		if (varIndex >= 0) {
			let i = varIndex + 5;

			while (i < value.length) {
				if (Number(value[i]) >= 0) {
					redisIndex += value[i];
					varName += value[i];
				}
				else {
					break;
				}
				i++;
			}
		}
		if (redisIndex) {
			const varValue = ((await this.stateRedis.lrange('1', Number(redisIndex), 0)) || [])[0];
			const valueProcessed = value.replace(`${varName}}`, `"${varValue}"`);

			return await this.getRedisVarString(valueProcessed);
		}
		return value;
	}

	async execute(value: string = ''): Promise<string> {
		return await (new Promise(async (resolve, reject) => {
			const valueProcessed = await this.getRedisVarString(value);

			exec(valueProcessed, async (error, stdout, stderr) => {
				if (error) {
					await this.stateRedis.lpush('1', error.message);

					return resolve(error.message);
				}
				if (stderr) {
					await this.stateRedis.lpush('1', stderr);

					return resolve(stderr);
				}
				await this.stateRedis.lpush('1', stdout);

				return resolve(stdout);
			});
		}));
	}

	async getDataIdByValue(value: string = ''): Promise<number> {
		return ((await this.dataRepository.findOne({
			where: {
				value,
			},
		})) || {})['id'] ?? (await this.dataRepository.save({ value }))['id'];
	}

	async getNextNeuron(nowNeuronId: number, value: string = ''): Promise<Chain> {
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
			return chainTrue;
		}
		const chainFalse = (await this.chainRepository.findOne({
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
		})) || (await this.chainRepository.findOne({
			relations: {
				data: true,
			},
			where: {
				parentId: nowNeuronId,
				isSaved: false,
				isTrue: false,
				data: {
					value: Not(value),
				},
			},
		})) || (await this.chainRepository.findOne({
			where: {
				parentId: nowNeuronId,
				isTrue: false,
			},
			order: {
				id: 'DESC',
			},
		}));

		return chainFalse;
	}

	async pass(neuronId: number, value: string = ''): Promise<Array<number>> {
		const currentChain = [ ...this.getCurrentChain() ];
		const nextNeuron = await this.getNextNeuron(neuronId, value);

		this.pushCurrentChain(neuronId);

		if (currentChain[currentChain.length - 1] === nextNeuron['neuronId']) {
			if (nextNeuron['isTrue'] === false) {
				const prevNeuron = await this.chainRepository.findOne({
					where: {
						parentId: nextNeuron['neuronId'],
						isTrue: false,
					},
				});
				const dataId = await this.getDataIdByValue(value);
				const points = (await this.getFreePoints(neuronId))[0];
				const newNeuronId = (await this.repository.save({ 
					x: points['x'], 
					y: points['y'], 
				}))['id'];

					if (prevNeuron) {
					await this.chainRepository.save({ 
						id: prevNeuron['id'],
						dataId,
						isTrue: true,
						isSaved: true,
					});
				}
				await this.chainRepository.save({
					parentId: neuronId,
					neuronId: newNeuronId,
					dataId,
					isTrue: true,
					isSaved: true,
				});
				await this.chainRepository.save({
					parentId: newNeuronId,
					neuronId: neuronId,
					dataId,
					isTrue: true,
					isSaved: true,
				});
				await this.chainRepository.save({
					parentId: newNeuronId,
					neuronId: currentChain[currentChain.length - 1],
					dataId,
					isTrue: false,
					isSaved: true,
				});
				await this.chainRepository.save({
					parentId: currentChain[currentChain.length - 1],
					neuronId: newNeuronId,
					dataId,
					isTrue: false,
					isSaved: false,
				});

				this.pushCurrentChain(newNeuronId);
			}
			return this.getCurrentChain();
		}
		return await this.pass(nextNeuron['neuronId'], value);
	}

	async step(neuronId: number, value: string = ''): Promise<any> {
		const prevNeuronId = Number(await this.stateRedis.get('prevNeuronId'));
		let neuronIdProcessed = neuronId;

		if (prevNeuronId > 0) {
			neuronIdProcessed = prevNeuronId;
		}
		const chain = await this.pass(neuronIdProcessed, value);
		const chainProcessed = chain.join('-');
		const chainItems = await this.chainRepository.find({
			relations: {
				data: true,
			},
			where: {
				parentId: chain[chain.length - 1],
				isTrue: true,
				data: {
					value: Not(value),
				},
			},
			order: {
				id: 'DESC',
			},
		});
		let i = 0,
			nextValue;

		while (i < chainItems.length) {
			let nextChainItem = await this.chainRepository.findOne({
				relations: {
					data: true,
				},
				where: {
					parentId: chain[chain.length - 1],
					isTrue: true,
					data: {
						value: chainItems[i]['data']['value'],
					},
				},
			});

			if (nextChainItem) {
				nextValue = chainItems[i]['data']['value'];

				break;
			}
			i++;
		}
		this.clearCurrentChain();

		await this.stateRedis.set('prevNeuronId', String(neuronId));

		if (nextValue) {
			const outputRecursive = await this.step(chain[chain.length - 1], nextValue);
			const newChain = new Set([ 
				...chain,
				...outputRecursive['chain'], 
			]);

			return {
				chain: Array.from(newChain),
				value: outputRecursive['value'],
			};
		}
		return {
			chain,
			value: await this.execute(value),
		};
	}
}
