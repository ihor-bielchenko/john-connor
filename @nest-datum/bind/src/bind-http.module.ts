import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { BindService } from './bind.service';
import { BindHttpController } from './bind-http.controller';

@Module({
	imports: [],
	controllers: [ BindHttpController ],
	providers: [ 
		BindService, 
	],
})
export class BindHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
