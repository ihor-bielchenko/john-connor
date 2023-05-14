import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { MainService } from './main.service';
import { MainHttpTcpController } from './main-http-tcp.controller';

@Module({
	imports: [],
	controllers: [ MainHttpTcpController ],
	providers: [ 
		MainService,
	],
})
export class MainHttpTcpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
