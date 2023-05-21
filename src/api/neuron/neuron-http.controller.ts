import { 
	Controller,
	Get,
	Query,
	MethodNotAllowedException,
} from '@nestjs/common';
import { strToArr as utilsFormatStrToArr } from '@nest-datum-utils/format';
import { 
	str as utilsCheckStr,
	numericInt as utilsCheckNumericInt, 
} from '@nest-datum-utils/check';
import { HttpController } from '@nest-datum-common/controllers-v2.2.0';
import { NeuronService } from './neuron.service';

@Controller(`/neuron`)
export class NeuronHttpController extends HttpController {
	constructor(
		protected readonly service: NeuronService,
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

	@Get('step')
	async step(
		@Query('id') id: number,
		@Query('value') value: string,
	) {
		return await this.serviceHandlerWrapper(async () => {
			const options = await this.validateStep({
				id,
				value,
			})

			return await this.service.step(options['id'], options['value']);
		});
	}
}
