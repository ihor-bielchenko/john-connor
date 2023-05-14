import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum-common/controllers-v2.2.0';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
	strDescription as utilsCheckStrDescription,
	strFilled as utilsCheckStrFilled,
	strEmail as utilsCheckStrEmail,
	str as utilsCheckStr,
} from '@nest-datum-utils/check';
import { NeuronService } from './neuron.service';

@Controller()
export class NeuronTcpController extends TcpController {
	constructor(
		protected service: NeuronService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'neuron.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'neuron.one' })
	async one(payload) {
		return await super.one(payload);
	}

	@EventPattern('neuron.drop')
	async drop(payload) {
		return await super.drop(payload);
	}

	@EventPattern('neuron.dropMany')
	async dropMany(payload) {
		return await super.dropMany(payload);
	}

	@EventPattern('neuron.create')
	async create(payload: object = {}) {
		return await super.create(payload);
	}

	@EventPattern('neuron.update')
	async update(payload: object = {}) {
		return await super.update(payload);
	}

	@EventPattern('neuron.start')
	async start(payload: object = {}) {
		return await this.start(payload);
	}

	@EventPattern('neuron.stop')
	async stop(payload: object = {}) {
		return await this.stop(payload);
	}

	@EventPattern('neuron.not')
	async not(payload: object = {}) {
		return await this.not(payload);
	}
}
