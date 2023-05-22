import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
} from '@nestjs/common';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { ChainHttpTcpController } from './chain-http-tcp.controller';

@Module({
	controllers: [ ChainHttpTcpController ],
	imports: [
		TransportModule,
	],
	providers: [ 
		TransportService, 
	],
})
export class ChainHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
