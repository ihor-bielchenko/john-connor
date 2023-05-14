import { Injectable } from '@nestjs/common';
import { TaskService } from '@nest-datum/task';
import { FailureException } from '@nest-datum-common/exceptions';
import { 
	callerFunc as utilsFormatCallerFunc,
	strToObj as utilsFormatStrToObj, 
} from '@nest-datum-utils/format';
import { objFilled as utilsCheckObjFilled } from '@nest-datum-utils/check';

@Injectable()
export class QueueService extends TaskService {
	protected name: string;

	protected readonly delay: number = 0;
	protected readonly serviceLoop;
	protected readonly repository;

	public listen() {
		this.serviceLoop.create({ name: this.name, delay: this.delay, callback: this.execution.bind(this) });

		return this;
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		const data = await super.createProcess(processedPayload, payload);

		await this.repository.rpush(this.name, JSON.stringify(data));

		return data;
	}

	public async execution(): Promise<object> {
		try {
			const taskDataStr = await this.repository.lindex(this.name, 0);

			await this.repository.lrem(this.name, 1, taskDataStr);
			await this.executionBefore(this.data);

			const taskData = utilsFormatStrToObj(taskDataStr);

			if (!utilsCheckObjFilled(taskData)) {
				throw new FailureException(`Task signature of "${this.name}" is not valid.`);
			}		
			const processedPayload = await this.executionProperties(taskData);
			const output = await this.executionProcess(processedPayload);

			return await this.executionOutput(processedPayload, await this.executionAfter(processedPayload, output));
		}
		catch (err) {
			this.errorAt = new Date();
			
			await this.onError(err, this.data);
		}
	}
}
