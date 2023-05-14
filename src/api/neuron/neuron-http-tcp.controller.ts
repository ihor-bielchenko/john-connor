import { 
	Controller,
	Get,
	Param,
} from '@nestjs/common';
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

	@Get('start/:id')
	async start(@Param('id') id: number) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.start`,
		}, { id }));
	}

	@Get('stop/:id')
	async stop(@Param('id') id: number) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.stop`,
		}, { id }));
	}

	@Get('not')
	async not() {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.not`,
		}, {}));
	}
}
