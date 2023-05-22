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
import { TransportService } from '@nest-datum/transport';
import { HttpTcpController } from '@nest-datum-common/controllers-v2.2.0';

@Controller(`${process.env.SERVICE_JOHN_CONNOR}/neuron`)
export class NeuronHttpTcpController extends HttpTcpController {
	protected readonly serviceName: string = process.env.SERVICE_JOHN_CONNOR;
	protected readonly entityName: string = 'neuron';

	constructor(
		protected transport: TransportService,
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
		return await this.serviceHandlerWrapper(
			async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.step`,
		}, await this.validateStep({
			id,
			value,
		})));
	}
}
