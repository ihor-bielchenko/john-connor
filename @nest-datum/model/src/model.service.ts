import { Injectable } from '@nestjs/common';
import { 
	strEnvKey as utilsCheckStrEnvKey,
	strName as utilsCheckStrName, 
} from '@nest-datum-utils/check';
import { strToEnv as formatStrToEnv } from '@nest-datum-utils/format';

@Injectable()
export class ModelService {
	protected readonly withEnvKey: boolean = false;
	protected name: string;

	protected prefix(keyName?: string): string {
		return `${process.env.USER_ID}|${process.env.PROJECT_ID}|${(this.name = (this.name ?? this.constructor.name))}${keyName ? ('|'+ keyName) : ''}`;
	}

	protected async before(payload): Promise<any> {
	}

	protected async after(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return data;
	}

	public async many(payload): Promise<Array<any>> {
		await this.manyBefore(payload);

		const processedPayload = await this.manyProperties(payload);
		const output = await this.manyProcess(processedPayload, payload);
		
		return await this.manyOutput(processedPayload, await this.manyAfter(payload, processedPayload, output));
	}

	protected async manyProperties(payload): Promise<object> {
		return payload;
	}

	protected async manyBefore(payload: object): Promise<any> {
		return await this.before(payload);
	}

	protected async manyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async manyProcess(processedPayload: object, payload: object): Promise<Array<Array<any> | number>> {
		return [ [], 0 ];
	}

	protected async manyOutput(payload: object, data: any): Promise<Array<any>> {
		return data;
	}

	public async one(payload: object): Promise<any> {
		await this.oneBefore(payload);

		const processedPayload = await this.oneProperties(payload);
		const output = await this.oneProcess(processedPayload, payload);
		
		return await this.oneOutput(processedPayload, await this.oneAfter(payload, processedPayload, output));
	}

	protected async oneProperties(payload: object): Promise<object> {
		return payload;
	}

	protected async oneBefore(payload: object): Promise<any> {
		return await this.before(payload);
	}

	protected async oneAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async oneProcess(processedPayload: object, payload: object): Promise<any> {
		return undefined;
	}

	protected async oneOutput(payload: object, data: any): Promise<any> {
		return data;
	}

	public async create(payload: object = {}): Promise<object> {
		await this.createBefore(payload);
		
		const processedPayload = await this.createProperties(payload);
		const output = await this.createProcess(processedPayload, payload);

		return await this.createOutput(processedPayload, await this.createAfter(payload, processedPayload, output));
	}

	protected async createProperties(payload: object): Promise<object> {
		if (this.withEnvKey === true) {
			if (!utilsCheckStrEnvKey(payload['envKey']) && utilsCheckStrName(payload['name'])) {
				payload['envKey'] = payload['name'];
			}
			const currentServiceName = this.constructor.name
				.split(/(?=[A-Z])/)
				.slice(0, -1)
				.join('_');

			if (payload['envKey'].indexOf(`${process.env.PROJECT_ID}_${process.env.APP_NAME}_${currentServiceName}`) <= 0) {
				payload['envKey'] = `${process.env.PROJECT_ID}_${process.env.APP_NAME}_${currentServiceName}_${payload['envKey']
					.replace(new RegExp(process.env.PROJECT_ID, 'g'), '')
					.replace(new RegExp(process.env.APP_NAME, 'g'), '')
					.replace(new RegExp(currentServiceName, 'g'), '')}`;
			}
			else if (payload['envKey'].indexOf(`${process.env.PROJECT_ID}_${process.env.APP_NAME}`) <= 0) {
				payload['envKey'] = `${process.env.PROJECT_ID}_${process.env.APP_NAME}_${payload['envKey']
					.replace(new RegExp(process.env.PROJECT_ID, 'g'), '')
					.replace(new RegExp(process.env.APP_NAME, 'g'), '')}`;
			}
			else if (payload['envKey'].indexOf(process.env.PROJECT_ID) <= 0) {
				payload['envKey'] = `${process.env.PROJECT_ID}_${payload['envKey'].replace(new RegExp(process.env.PROJECT_ID, 'g'), '')}`;
			}
			payload['envKey'] = formatStrToEnv(payload['envKey']);
		}
		else {
			delete payload['envKey'];
		}
		return payload;
	}

	protected async createBefore(payload: object): Promise<any> {
		return await this.before(payload);
	}

	protected async createAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		return {};
	}

	protected async createOutput(payload: object, data: any): Promise<object> {
		return data;
	}

	public async update(payload: object = {}): Promise<object> {
		await this.updateBefore(payload);

		const processedPayload = await this.updateProperties(payload);
		const output = await this.updateProcess(payload['id'], processedPayload, payload);

		return await this.updateOutput(processedPayload, await this.updateAfter(payload, processedPayload, output));
	}

	protected async updateProperties(payload: object): Promise<object> {
		if (!this.withEnvKey || !utilsCheckStrEnvKey(payload['envKey'])) {
			delete payload['envKey'];
		}
		return payload;
	}

	protected async updateBefore(payload: object): Promise<any> {
		return await this.before(payload);
	}

	protected async updateAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async updateProcess(id: string, processedPayload: object, payload: object): Promise<object> {
		return processedPayload;
	}

	protected async updateOutput(payload: object, data: any): Promise<object> {
		return data;
	}

	public async drop(payload: object): Promise<boolean> {
		await this.dropBefore(payload);

		const processedPayload = await this.dropProperties(payload);
		const output = await this.dropProcess(processedPayload, payload);

		return await this.dropOutput(processedPayload, await this.dropAfter(payload, processedPayload, output));
	}

	protected async dropProperties(payload): Promise<object> {
		return payload;
	}

	protected async dropBefore(payload: object): Promise<any> {
		return await this.before(payload);
	}

	protected async dropAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async dropProcess(processedPayload: object | string, payload: object): Promise<any> {
	}

	protected async dropOutput(payload: object, data: any): Promise<boolean> {
		return true;
	}

	public async dropMany(payload: object): Promise<boolean> {
		await this.dropManyBefore(payload);

		const processedPayload = await this.dropManyProperties(payload);
		const output = await this.dropManyProcess(processedPayload, payload);

		return await this.dropManyOutput(processedPayload, await this.dropAfter(payload, processedPayload, output));
	}

	protected async dropManyProperties(payload: object): Promise<any> {
		return payload;
	}

	protected async dropManyBefore(payload: object): Promise<any> {
		return await this.before(payload);
	}

	protected async dropManyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async dropManyProcess(processedPayload: Array<string>, payload: object): Promise<any> {
	}

	protected async dropManyProcessForever(idsArrOrId: string | Array<string>): Promise<any> {
	}

	protected async dropManyProcessPrepare(id: string): Promise<any> {
	}

	protected async dropManyOutput(payload: object, data: any): Promise<boolean> {
		return true;
	}
}
