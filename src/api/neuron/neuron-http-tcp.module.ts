import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { NeuronHttpTcpController } from './neuron-http-tcp.controller';

@Module({
	controllers: [ NeuronHttpTcpController ],
	imports: [
		TransportModule,
	],
	providers: [ 
		TransportService, 
	],
})
export class NeuronHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
