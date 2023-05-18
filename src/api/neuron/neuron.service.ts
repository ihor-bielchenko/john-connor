import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
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
		@InjectRedis('State') protected readonly redisRepository: Redis,
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

	async pass(nowNeuronId: number, value: string = ''): Promise<any> {
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
				neuronId: chainTrue['neuronId'],
				value: chainTrue['data']['value'],
			};
		}
		const chainTrueWithValue = await this.chainRepository.findOne({
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

		if (chainTrueWithValue) {
			return {
				neuronId: chainTrueWithValue['neuronId'],
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
			// const dataId = ((await this.dataRepository.findOne({
			// 	where: {
			// 		value,
			// 	},
			// })) || {})['id'] ?? (await this.dataRepository.save({ value }))['id'];
			// const points = (await this.getFreePoints(nowNeuronId))[0];
			// const newNeuronId = (await this.repository.save({ x: points['x'], y: points['y'], isFortified: false }))['id'];

			// console.log('cha1inF1alse1', chainFalse, [{
			// 	parentId: nowNeuronId,
			// 	neuronId: chainFalse['neuronId'],
			// 	isTrue: true,
			// 	dataId,
			// }, {
			// 	parentId: nowNeuronId,
			// 	neuronId: newNeuronId,
			// 	isTrue: false,
			// 	dataId,
			// }, {
			// 	parentId: newNeuronId,
			// 	neuronId: chainFalse['neuronId'],
			// 	isTrue: true,
			// 	dataId,
			// }, {
			// 	parentId: newNeuronId,
			// 	neuronId: nowNeuronId,
			// 	isTrue: false,
			// 	dataId,
			// }, {
			// 	parentId: chainFalse['neuronId'],
			// 	neuronId: nowNeuronId,
			// 	isTrue: false,
			// 	dataId,
			// }, {
			// 	parentId: chainFalse['neuronId'],
			// 	neuronId: newNeuronId,
			// 	isTrue: true,
			// 	dataId,
			// }]);

			// await this.chainRepository.save({
			// 	parentId: nowNeuronId,
			// 	neuronId: chainFalse['neuronId'],
			// 	isTrue: true,
			// 	dataId,
			// });
			// await this.chainRepository.save({
			// 	parentId: nowNeuronId,
			// 	neuronId: newNeuronId,
			// 	isTrue: false,
			// 	dataId,
			// });
			// await this.chainRepository.save({
			// 	parentId: newNeuronId,
			// 	neuronId: chainFalse['neuronId'],
			// 	isTrue: true,
			// 	dataId,
			// });
			// await this.chainRepository.save({
			// 	parentId: newNeuronId,
			// 	neuronId: nowNeuronId,
			// 	isTrue: false,
			// 	dataId,
			// });
			// await this.chainRepository.save({
			// 	parentId: chainFalse['neuronId'],
			// 	neuronId: newNeuronId,
			// 	isTrue: true,
			// 	dataId,
			// });
			// await this.chainRepository.save({
			// 	parentId: chainFalse['neuronId'],
			// 	neuronId: nowNeuronId,
			// 	isTrue: false,
			// 	dataId,
			// });
			// await this.repository.save({ id: chainFalse['parentId'], isFortified: true });

			// return {
			// 	neuronId: newNeuronId,
			// 	value,
			// };
		}
		return {
			neuronId: chainFalse['neuronId'],
			value,
		};
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
