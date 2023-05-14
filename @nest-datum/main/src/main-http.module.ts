import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { MainService } from './main.service';
import { MainHttpController } from './main-http.controller';

@Module({
	imports: [],
	controllers: [ MainHttpController ],
	providers: [ 
		MainService,
	],
})
export class MainHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
