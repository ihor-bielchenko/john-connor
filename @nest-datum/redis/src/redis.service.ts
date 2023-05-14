import { Injectable } from '@nestjs/common';
import { strToObj as utilsFormatStrToObj } from '@nest-datum-utils/format';
import {
	strFilled as utilsCheckStrFilled,
	strId as utilsCheckStrId,
	numericInt as utilsCheckNumericInt,
	func as utilsCheckFunc,
	exists as utilsCheckExists,
	objFilled as utilsCheckObjFilled,
	numeric as utilsCheckNumeric,
	arrFilled as utilsCheckArrFilled,
} from '@nest-datum-utils/check';
import { 
	MethodNotAllowedException,
	NotFoundException, 
} from '@nest-datum-common/exceptions';
import { ModelService } from '@nest-datum/model';

@Injectable()
export class RedisService extends ModelService {
	protected readonly repository;

	protected async oneProperties(payload: object): Promise<object> {
		if (!utilsCheckStrFilled(payload['key'])) {
			throw new MethodNotAllowedException(`Property "key" is not valid.`);
		}
		return payload;
	}

	protected async manyProperties(payload): Promise<object> {
		if (payload['keys'] && !utilsCheckArrFilled(payload['keys'])) {
			throw new MethodNotAllowedException(`Property "keys" is not valid.`);
		}
		else {
			return payload;
		}
		if (!utilsCheckStrFilled(payload['match'])) {
			throw new MethodNotAllowedException(`Property "match" is not valid.`);
		}
		if (utilsCheckExists(payload['count']) && !utilsCheckNumericInt(payload['count'])) {
			throw new MethodNotAllowedException(`Property "count" is not valid.`);
		}
		if (utilsCheckExists(payload['callback']) && !utilsCheckFunc(payload['callback'])) {
			throw new MethodNotAllowedException(`Property "callback" is not valid.`);
		}
		return payload;
	}

	protected async createProperties(payload: object): Promise<object> {
		if (!utilsCheckStrFilled(payload['key'])) {
			throw new MethodNotAllowedException(`Property "key" is not valid.`);
		}
		return await super.createProperties(payload);
	}

	protected async updateProperties(payload: object): Promise<object> {
		if (!utilsCheckStrFilled(payload['key'])) {
			throw new MethodNotAllowedException(`Property "key" is not valid.`);
		}
		if (payload['newKey'] && !utilsCheckStrId(payload['newKey'])) {
			throw new MethodNotAllowedException(`Property "newKey" is not valid.`);
		}
		return await super.updateProperties(payload);
	}

	protected async dropProperties(payload): Promise<object> {
		if (!utilsCheckStrFilled(payload['key'])) {
			throw new MethodNotAllowedException(`Property "key" is not valid.`);
		}
		return payload;
	}

	protected async oneProcess(processedPayload: object, payload: object): Promise<any> {
		let output;

		try {
			output = await this.repository.get(processedPayload['key']);
		}
		catch (err) {
			throw new NotFoundException(`Property "${processedPayload['key']}" in not found.`);
		}
		return utilsFormatStrToObj(output) ?? output;
	}

	protected async manyProcess(processedPayload: object, payload: object): Promise<Array<Array<any> | number>> {
		if (processedPayload['keys']) {
			let i = 0,
				output = [];

			while (i < processedPayload['keys'].length) {
				if (utilsCheckStrFilled(processedPayload['keys'][i]) || utilsCheckNumeric(processedPayload['keys'][i])) {
					const item = await this.oneProcess({ key: processedPayload['keys'][i] }, payload);

					if (item) {
						output.push(utilsFormatStrToObj(item) ?? item);
					}
				}
				i++;
			}
			return output;
		}
		return await this.scan({ callback: async (key) => key, ...processedPayload });
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		const data = { ...processedPayload };

		delete data['key'];
		await this.repository.set(processedPayload['key'], JSON.stringify(data));

		return processedPayload;
	}

	protected async updateProcess(key: string, processedPayload: object, payload: object): Promise<object> {
		if (processedPayload['newKey']) {
			this.dropProcess(key, payload);

			return await this.createProcess({ key: processedPayload['newKey'], ...processedPayload }, payload);
		}
		return await this.createProcess({ key, ...processedPayload }, payload);
	}

	protected async dropProcess(processedPayload: object | string, payload: object): Promise<any> {
		const keys = await this.manyProcess({ match: processedPayload['key'], disableAnyPattern: true }, payload);
		let i = 0;

		while (i < keys[0]['length']) {
			await this.repository.del(keys[0][i]);
			i++;
		}
		await this.repository.del(processedPayload['key']);

		return true;
	}

	protected async dropManyProcess(processedPayload: Array<string>, payload: object): Promise<any> {
		let i = 0;

		while (i < processedPayload.length) {
			await this.dropProcess({ key: processedPayload[i] }, payload);
			i++;
		}
		return true;
	}

	private async scan(processedPayload: object): Promise<Array<Array<any> | number>> {
		let output = [],
			match = processedPayload['match'],
			count = processedPayload['count'] ?? 64,
			callback = processedPayload['callback'] ?? (async (item, index) => item);

		if (utilsCheckStrFilled(match) && !processedPayload['disableAnyPattern']) {
			if (match[0] !== '*') {
				match = `*${processedPayload['match']}`;
			}
			if (match[match.length - 1] !== '*') {
				match = `${match}*`;
			}
		}
		await (new Promise(async (resolve, reject) => (await this.repository.scanStream({ match, count }))
			.on('data', async (resultKeys) => {
				let i = 0;

				while (i < resultKeys.length) {
					try {
						output.push(await callback(resultKeys[i], i, processedPayload));
					}
					catch (err) {
						return reject(err);
					}
					i++;
				}
			})
			.on('end', () => setTimeout(() => {
				resolve(output);
			}, 0))));

		return [ output, output.length ];
	}
}
