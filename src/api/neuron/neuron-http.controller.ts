import { 
	Controller,
	Get,
	Param,
} from '@nestjs/common';
import { HttpController } from '@nest-datum-common/controllers-v2.2.0';
import { NeuronService } from './neuron.service';

@Controller(`/neuron`)
export class NeuronHttpController extends HttpController {
	constructor(
		protected readonly service: NeuronService,
	) {
		super();
	}

	@Get('start/:id')
	async start(@Param('id') id: number) {
		return await this.serviceHandlerWrapper(async () => await this.service.start({ id }));
	}

	@Get('stop/:id')
	async stop(@Param('id') id: number) {
		return await this.serviceHandlerWrapper(async () => await this.service.stop({ id }));
	}

	@Get('not')
	async not() {
		return await this.serviceHandlerWrapper(async () => await this.service.not({}));
	}
}
