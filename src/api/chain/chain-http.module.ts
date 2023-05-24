import { 
	Module,
	NestModule,
	MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { Neuron } from '../neuron/neuron.entity';
import { State } from '../state/state.entity';
import { Data } from '../data/data.entity';
import { ChainService } from './chain.service';
import { ChainHttpController } from './chain-http.controller';
import { Chain } from './chain.entity';

@Module({
	controllers: [ ChainHttpController ],
	imports: [
		TypeOrmModule.forFeature([
			Chain,
			State,
			Neuron,
			Data,
		]),
		CacheModule,
	],
	providers: [ 
		CacheService,
		ChainService,
	],
})
export class ChainHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
