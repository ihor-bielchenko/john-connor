import { 
	Module,
	NestModule,
	MiddlewareConsumer, 
	RequestMethod,
} from '@nestjs/common';
import { ManyService } from './many.service';
import { ManyHttpController } from './many-http.controller';

@Module({
	imports: [],
	controllers: [ ManyHttpController ],
	providers: [ 
		ManyService,
	],
})
export class ManyHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
