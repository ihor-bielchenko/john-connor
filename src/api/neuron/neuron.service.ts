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

const intervals = {};

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

	async getChainId(ids: Array<number> = [ 1, 2, 3 ], value: string = '', isNotEqual = false): Promise<number> {
		const output = await this.connection.query(`SELECT
				\`chain_item\`.\`id\` AS \`chainItemId\`,
				\`chain_item\`.\`chainId\` AS \`chainId\`,
				\`chain_item\`.\`neuronId\` AS \`chainItemNeuronId\`,
				\`chain_item\`.\`order\` AS \`order\`,
				\`chain\`.\`neuronId\` AS \`chainNeuronId\`,
				\`chain\`.\`dataId\` AS \`dataId\`,
				\`chain\`.\`name\` AS \`chainName\`,
				\`data\`.\`value\` AS \`value\`,
				COUNT(\`chain_item\`.\`neuronId\`) as \`length\`
			FROM \`chain_item\`
			LEFT JOIN \`chain\`
			ON \`chainId\` = \`chain\`.\`id\`
			LEFT JOIN \`data\`
			ON \`chain\`.\`dataId\` = \`data\`.\`id\`
			WHERE
				${!isNotEqual ? `\`data\`.\`value\` = "${value}" AND ` : ''}
				(${ids
					.map((neuronId, index) => `(\`chain_item\`.\`neuronId\` = ${neuronId} AND \`chain_item\`.\`order\` = ${index})`)
					.join(' OR ')})
			GROUP BY \`chainNeuronId\`
			HAVING \`length\` = ${ids.length}
			ORDER BY \`chainNeuronId\`;`);

		if (isNotEqual) {
			let i = 0;

			while (i < output.length) {
				i++;
			}
		}
		return ((isNotEqual === false)
			|| (isNotEqual && output[0] && value !== output[0]['value']))
			? (output[0] || {})['chainId']
			: undefined;
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

	async createChain(ids: Array<number> = [ 1, 2, 3 ], newValue: string = ''): Promise<number> {
		const points = await this.getFreePoints(ids[ids.length - 1]);
		const newDataId = ((await this.dataRepository.findOne({
			where: {
				value: newValue,
			},
		})) || {})['id'] ?? (await this.dataRepository.save({ value: newValue }))['id'];

		const trueNeuronId = (await this.repository.save({
			x: points[0]['x'],
			y: points[0]['y'],
		}))['id'];
		const falseNeuronId = (await this.repository.save({
			x: points[1]['x'],
			y: points[1]['y'],
		}))['id'];
		const trueChainId = (await this.chainRepository.save({
			neuronId: trueNeuronId,
			dataId: newDataId,
		}))['id'];
		const falseChainId = (await this.chainRepository.save({
			neuronId: falseNeuronId,
			dataId: newDataId,
		}))['id'];
		let i = 0;

		while (i < ids.length) {
			await this.chainItemRepository.save({
				chainId: trueChainId,
				neuronId: ids[i],
				order: i,
			});
			i++;
		}
		i = 0;
		ids = [ ...ids.slice(0, -1), trueNeuronId ];
		
		while (i < ids.length) {
			await this.chainItemRepository.save({
				chainId: falseChainId,
				neuronId: ids[i],
				order: i,
			});
			i++;
		}
		return trueChainId;
	}

	async updateState(id: number, index: number, nowData = []): Promise<number> {
		const newData = [ ...nowData.splice(index, nowData.length), ...nowData ];
		let i = 0;

		await this.redisRepository.del(String(id));
		while (i < newData.length) {
			await this.redisRepository.rpush(String(id), newData[i]);
			i++;
		}
		return newData[0];
	}

	async nextChain(nowChainId: number, nowIds: Array<number> = [ 1, 2, 3 ], value: string = ''): Promise<number> {
		const nowChainItems = await this.chainItemRepository.find({
			where: nowIds.map((neuronId, order) => ({
				chainId: nowChainId,
				neuronId,
				order,
			})),
			order: {
				order: 'ASC',
			},
		});
		const nowChain = await this.chainRepository.findOne({
			where: {
				id: nowChainId,
			},
		});
		const newIds = [ ...nowChainItems.map(({ neuronId }) => neuronId), nowChain['neuronId'] ];
		let newChainId = await this.getChainId(newIds, value);

		if (newChainId > 0) {
			const nowChainList = (await this.redisRepository.lrange(String(nowIds[0]), 0, -1))
				.map((item) => Number(item));
			const newChainListIndex = nowChainList.indexOf(newChainId);

			if (newChainListIndex >= 0) {
				await this.updateState(nowIds[0], newChainListIndex, nowChainList);
			}
			else {
				await this.redisRepository.lpush(String(nowIds[0]), newChainId);
			}
		}
		else {
			newChainId = await this.createChain(newIds, value);
		}
		return newChainId;
	}

	async chain(ids: Array<number> = [ 1, 2, 3 ], value: string = ''): Promise<number> {
		let chainId = await this.getChainId(ids.slice(0, -1), value);

		if (chainId > 0) {
			return await this.nextChain(chainId, ids, value);
		}
		return await this.nextChain(await this.getChainId((ids = [ ...ids.slice(0, -2), ids[ids.length - 1] ]), value, true), ids, value);
	}

	async pass(id: number, value: string = ''): Promise<number> {
		const neuronItems = (await this.chainItemRepository.find({ 
			relations: {
				chain: true,
			},
			where: {
				chainId: id,
			}, 
			order: {
				order: 'ASC',
			},
		})) || [];
		const nowIds = [ 
			...(neuronItems || []).map(({ neuronId }) => Number(neuronId)), 
			(((neuronItems || [])[0] || {})['chain'] || {})['neuronId'], 
		];
		
		return await this.chain(nowIds, value);
	}

	async start(payload) {
		clearInterval(intervals[payload['id']]);
		
		intervals[payload['id']] = setInterval(async () => {
			await this.pass(payload['id'], payload['value']);
		}, 0);

		return payload;
	}

	async stop(payload) {
		clearInterval(intervals[payload['id']]);

		return payload;
	}

	async execute(value: string = '') {
		return value;
	}
}
