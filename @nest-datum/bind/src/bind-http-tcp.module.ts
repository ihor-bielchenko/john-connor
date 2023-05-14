import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { TransportService } from '@nest-datum/transport';
import { BindHttpTcpController } from './bind-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ BindHttpTcpController ],
	providers: [ 
		TransportService, 
	],
})
export class BindHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
