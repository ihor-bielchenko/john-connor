import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum-common/controllers-v2.2.0';
import { 
	str as utilsCheckStr,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';
import { NeuronService } from './neuron.service';

@Controller()
export class NeuronTcpController extends TcpController {
	constructor(
		protected service: NeuronService,
	) {
		super();
	}

	async validateStep(options: object = {}) {
		if (!utilsCheckNumericInt(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		if (!utilsCheckStr(options['value'])) {
			throw new MethodNotAllowedException(`Property "value" is not valid.`);
		}		
		return {
			id: Number(options['id']),
			value: String(options['value'] ?? ''),
		};
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

	@EventPattern('neuron.step')
	async step(payload: object = {}) {
		const { id, value } = await this.validateStep(payload);

		return await this.service.step(id, value);
	}
}
