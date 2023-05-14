import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { ModelService } from '@nest-datum/model';
import { callerFunc as utilsFormatCallerFunc } from '@nest-datum-utils/format';
import {
	strFilled as utilsCheckObjFilled,
	strId as utilsCheckStrId,
	strName as utilsCheckStrName,
} from '@nest-datum-utils/check';

@Injectable()
export class TaskService extends ModelService {
	protected name: string;
	protected id: string;
	protected createdAt: Date;
	protected updatedAt: Date;
	protected doneAt: Date;
	protected errorAt: Date;
	protected source: string;
	protected data: object;

	protected readonly currentAttempt: number = 0;
	protected readonly attemptsCount: number = 3;
	protected readonly delay: number = 0;

	protected async createProperties(payload: object): Promise<object> {
		if (payload['id'] && !utilsCheckStrId(payload['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		if (payload['name'] && !utilsCheckStrName(payload['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (!utilsCheckObjFilled(payload['data'])) {
			throw new MethodNotAllowedException(`Property "data" is not valid.`);
		}
		return await super.createProperties(payload);
	}

	protected async updateProperties(payload: object): Promise<object> {
		if (payload['id'] && !utilsCheckStrId(payload['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		if (payload['name'] && !utilsCheckStrName(payload['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (payload['data'] && !utilsCheckObjFilled(payload['data'])) {
			throw new MethodNotAllowedException(`Property "data" is not valid.`);
		}
		return await super.updateProperties(payload);
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		return {
			id: (this.id = (processedPayload['id'] ?? uuidv4())),
			name: (this.name = this.prefix(processedPayload['name'])),
			createdAt: (this.createdAt = new Date()),
			updatedAt: (this.updatedAt = undefined),
			doneAt: (this.doneAt = undefined),
			errorAt: (this.errorAt = undefined),
			source: (this.source = utilsFormatCallerFunc()),
			data: (this.data = processedPayload['data']),
		};
	}

	protected async updateProcess(id: string, processedPayload: object, payload: object): Promise<object> {
		return {
			id: (this.id = (processedPayload['newId'] ?? this.id)),
			name: (this.name = (processedPayload['name'] ? this.prefix(processedPayload['name']) : this.name)),
			updatedAt: (this.updatedAt = new Date()),
			data: (this.data = (processedPayload['data'] ?? this.data)),
		};
	}

	public async onError(err: Error, payload: object): Promise<any> {		
	}

	public async onSuccess(payload: object): Promise<any> {		
	}

	public async execution(): Promise<object> {
		try {
			await this.executionBefore(this.data);
		
			const processedPayload = await this.executionProperties(this.data);
			const output = await this.executionProcess(processedPayload);

			return await this.executionOutput(processedPayload, await this.executionAfter(processedPayload, output));
		}
		catch (err) {
			this.errorAt = new Date();
			
			await this.onError(err, this.data);
		}
	}

	protected async executionProperties(payload: object): Promise<object> {
		return payload;
	}

	protected async executionBefore(payload: object): Promise<any> {
	}

	protected async executionAfter(processedPayload: object, data: any): Promise<any> {
	}

	protected async executionProcess(processedPayload: object): Promise<object> {
		return {};
	}

	protected async executionOutput(payload: object, data: any): Promise<object> {
		this.doneAt = new Date();

		return await this.onSuccess(data);
	}
}
