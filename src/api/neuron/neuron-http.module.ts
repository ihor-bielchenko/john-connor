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
import { NeuronService } from './neuron.service';
import { NeuronHttpController } from './neuron-http.controller';
import { Neuron } from './neuron.entity';
import { Chain } from '../chain/chain.entity';
import { ChainItem } from '../chain-item/chain-item.entity';
import { Data } from '../data/data.entity';

@Module({
	controllers: [ NeuronHttpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Neuron,
			Chain,
			ChainItem,
			Data, 
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		NeuronService, 
	],
})
export class NeuronHttpModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
	}
}
