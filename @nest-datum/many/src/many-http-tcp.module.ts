import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { ManyHttpTcpController } from './many-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ ManyHttpTcpController ],
	providers: [ 
		TransportService,
	],
})
export class ManyHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
