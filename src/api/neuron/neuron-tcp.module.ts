import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { NeuronService } from './neuron.service';
import { NeuronTcpController } from './neuron-tcp.controller';
import { Neuron } from './neuron.entity';
import { Chain } from '../chain/chain.entity';
import { State } from '../state/state.entity';
import { StateItem } from '../state-item/state-item.entity';
import { Data } from '../data/data.entity';

@Module({
	controllers: [ NeuronTcpController ],
	imports: [
		TypeOrmModule.forFeature([ 
			Neuron,
			Chain,
			State,
			StateItem,
			Data, 
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		NeuronService, 
	],
})
export class NeuronTcpModule {
}

