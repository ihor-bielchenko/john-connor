import { Injectable } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { 
	strName as utilsCheckStrName,
	numericInt as utilsCheckNumericInt,
	func as utilsCheckFunc, 
} from '@nest-datum-utils/check';

const _timeouts = {
	example: {
		loop: (async () => {}),
		task: [],
		exists: false,
	},
};

@Injectable()
export class LoopService extends ModelService {
	constructor(
		protected readonly tasks: Array<any>,
	) {
		super();
	}

	protected async createProperties(payload: object): Promise<object> {
		if (!utilsCheckStrName(payload['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (!utilsCheckNumericInt(payload['delay'])) {
			throw new MethodNotAllowedException(`Property "delay" is not valid.`);
		}
		if (!utilsCheckFunc(payload['callback'])) {
			throw new MethodNotAllowedException(`Property "callback" is not valid.`);
		}
		return await super.createProperties(payload);
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		if (!_timeouts[processedPayload['name']]) {
			_timeouts[processedPayload['name']] = {
				loop: (async () => {}),
				task: [],
				exists: false,
			};
		}
		_timeouts[processedPayload['name']].task.push(processedPayload['callback']);

		if (!_timeouts[processedPayload['name']].exists) {
			_timeouts[processedPayload['name']].exists = true;
			_timeouts[processedPayload['name']]['loop'] = await this.processTimeout(processedPayload['name'], processedPayload['delay']);

			utilsCheckFunc(_timeouts[processedPayload['name']]['loop'])
				&& (await _timeouts[processedPayload['name']]['loop']());
		}
		return processedPayload;
	}

	private async processTimeout(name: string, delay: number = 0): Promise<any> {
		return async () => {
			let i = 0;

			while (i < _timeouts[name]['task'].length) {
				const taskProcess = _timeouts[name]['task'][i];

				await taskProcess(new Date);
				i++;
			}
			
			await (new Promise((resolve, reject) => setTimeout(() => resolve(true), delay)));
			await _timeouts[name]['loop']();
		};
	}

	public start() {
		(async () => {
			let i = 0;

			while (i < this.tasks.length) {
				this.tasks[i]['listen']();
				i++;
			}
			return;
		})();

		return this;
	}
}
