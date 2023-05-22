import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { ChainService } from './chain.service';
import { Neuron } from '../neuron/neuron.entity';
import { State } from '../state/state.entity';
import { StateItem } from '../state-item/state-item.entity';
import { ChainTcpController } from './chain-tcp.controller';
import { Chain } from './chain.entity';

@Module({
	controllers: [ ChainTcpController ],
	imports: [
		TypeOrmModule.forFeature([
			Chain,
			Neuron,
			State,
			StateItem,
		]),
		CacheModule,
	],
	providers: [
		CacheService,
		ChainService, 
	],
})
export class ChainTcpModule {
}

