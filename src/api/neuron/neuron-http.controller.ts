import { 
	Controller,
	Get,
	Param,
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

	async validatePass(options: object = {}) {
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

	@Get('start/:id')
	async start(@Param('id') id: number) {
		return await this.serviceHandlerWrapper(async () => await this.service.start({ id }));
	}

	@Get('stop/:id')
	async stop(@Param('id') id: number) {
		return await this.serviceHandlerWrapper(async () => await this.service.stop({ id }));
	}

	@Get('pass/:id')
	async pass(
		@Param('id') id: number,
		@Query('value') value: string,
	) {
		return await this.serviceHandlerWrapper(async () => {
			const options = await this.validatePass({
				id,
				value,
			})

			return await this.service.pass(options['id'], options['value']);
		});
	}
}
