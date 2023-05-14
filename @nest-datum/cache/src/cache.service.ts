import Redis from 'ioredis';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import {
	arrFilled as utilsCheckArrFilled,
	objFilled as utlisCheckObjFilled,
	strFilled as utilsCheckStrFilled,
	numeric as utilsCheckNumeric,
} from '@nest-datum-utils/check';
import { 
	MethodNotAllowedException,
	FailureException, 
} from '@nest-datum-common/exceptions';
import { RedisService } from '@nest-datum/redis';

@Injectable()
export class CacheService extends RedisService {
	constructor(
		@InjectRedis('Cache') protected readonly repository: Redis,
	) {
		super();
	}

	protected async oneProperties(payload: object): Promise<object> {
		if (!utilsCheckArrFilled(payload['key'])) {
			throw new MethodNotAllowedException(`Property "payload" is not array.`);
		}
		const processedPayload = payload['key'];
		let key = '',
			i = 0;

		while (i < processedPayload.length) {
			if (utlisCheckObjFilled(processedPayload[i])) {
				const processedItem = { ...processedPayload[i] };

				delete processedItem['accessToken'];
				delete processedItem['refreshToken'];
				delete processedItem['userId'];

				key += JSON.stringify(processedItem);
			}
			else if (utilsCheckStrFilled(processedPayload[i]) || utilsCheckNumeric(processedPayload[i])) {
				key += String(processedPayload[i]);
			}
			else {
				throw new FailureException(`Query item is undefined.`);
			}
			if (i < (processedPayload.length - 1)) {
				key += '|';
			}
			i++;
		}
		return { key };
	}

	protected async manyProperties(payload): Promise<object> {
		return await this.oneProperties(payload);
	}

	protected async createProperties(payload: object): Promise<object> {
		if (!utilsCheckArrFilled(payload['key'])) {
			throw new MethodNotAllowedException(`Property "key" is not valid.`);
		}
		return await super.createProperties({ ...payload, ...await this.oneProperties(payload) });
	}

	protected async updateProperties(payload: object): Promise<object> {
		return await this.createProperties(payload);
	}

	protected async dropProperties(payload): Promise<object> {
		return await this.oneProperties(payload);
	}

	protected async oneOutput(payload: object, data: any): Promise<any> {
		if (utlisCheckObjFilled(data) && data['output']) {
			return data['output'];
		}
		return data;
	}

	protected async manyOutput(payload: object, data: any): Promise<Array<any>> {
		return await this.oneOutput(payload, data);
	}
}
