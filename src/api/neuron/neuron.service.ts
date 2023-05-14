import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { 
	Repository,
	Connection, 
	Not,
	MoreThan,
} from 'typeorm';
import { arrExistsSub as utilsCheckArrExistsSub } from '@nest-datum-utils/check';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import { Neuron } from './neuron.entity';
import { Chain } from '../chain/chain.entity';
import { ChainItem } from '../chain-item/chain-item.entity';
import { Data } from '../data/data.entity';

@Injectable()
export class NeuronService extends SqlService {
	protected readonly withTwoStepRemoval: boolean = true;
	protected readonly withEnvKey: boolean = false;
	protected readonly repositoryConstructor = Neuron;

	constructor(
		@InjectRepository(Neuron) protected readonly repository: Repository<Neuron>,
		@InjectRepository(Chain) protected readonly chainRepository: Repository<Chain>,
		@InjectRepository(ChainItem) protected readonly chainItemRepository: Repository<ChainItem>,
		@InjectRepository(Data) protected readonly dataRepository: Repository<Data>,
		@InjectRedis('State') protected readonly redisRepository: Redis,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}

	async save(ids: Array<number> = [ 1, 2, 3 ], newValue: string, neuron: object, ) {
		const newDataId = ((await this.dataRepository.findOne({
			where: {
				value: newValue,
			},
		})) || {})['id'] ?? (await this.dataRepository.save({ value: newValue }))['id'];
		const newNeuronId = (await this.repository.save({
			x: neuron['x'] - 5,
			y: neuron['y'],
		}))['id'];
		const newChainId = (await this.chainRepository.save({
			neuronId: newNeuronId,
			dataId: newDataId,
		}))['id'];
		let i = 0;

		while (i < ids.length) {
			await this.chainItemRepository.save({
				chainId: newChainId,
				neuronId: ids[i],
				order: i,
			});
			i++;
		}
		return newChainId;
	}

	async execute(value: string = '') {
		return value;
	}

	async chain(ids: Array<number> = [ 1, 2, 3 ], nowValue: string = '') {
		const nowNeuronId = ids[ids.length - 1];
		const motherNeuronId = ids[ids.length - 2];
		const nowChainItems = await this.chainItemRepository.find({
			relations: {
				chain: {
					data: true,
					neuron: true,
				},
				neuron: true,
			},
			where: ids
				.slice(0, -1) 
				.map((neuronId, order) => ({
					neuronId,
					order,
					chain: {
						neuronId: nowNeuronId,
						data: {
							value: nowValue,
						},
					},
				})),
			order: {
				order: 'ASC',
			},
		});
		const newValue = await this.execute(nowValue);

		if (nowChainItems.length === ids.length - 1) {
			const nowStateChainId = Number(await this.redisRepository.lindex('state', 0));
			
			if (nowStateChainId === nowChainItems[0]['chain']['id']) {
				const newChainItems = await this.chainItemRepository.find({
					relations: {
						chain: {
							data: true,
							neuron: true,
						},
						neuron: true,
					},
					where: ids.map((neuronId, order) => ({
						chainId: motherNeuronId,
						neuronId,
						order,
						chain: {
							data: {
								value: newValue,
							},
						},
					})),
					order: {
						order: 'ASC',
					},
				});
				const chainId = (newChainItems.length === ids.length)
					? newChainItems[0]['chain']['id']
					: await this.save(ids, newValue, nowChainItems[0]['chain']['neuron']);

				console.log('nowNeuronId000', chainId);

				if (Number(await this.redisRepository.lpop('state')) !== chainId) {
					await this.redisRepository.lpush('state', chainId);
				}
			}
			else {
				console.log('nowNeuronId!111!', nowChainItems[0]['chain']['id']);

				await this.redisRepository.lpush('state', nowChainItems[0]['chain']['id']);
			}
		}
		return nowNeuronId;
	}

	async start(payload) {
		console.log('start', payload);

		return payload;
	}

	async stop(payload) {
		console.log('stop', payload);

		return payload;
	}

	async not(payload) {
		console.log('not', payload);
		
		return payload;
	}
}
