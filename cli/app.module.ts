import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { sqlConfig as utilsFormatSqlConfig } from '@nest-datum-utils/format';
import { 
	CacheModule,
	CacheService, 
} from '@nest-datum/cache';
import { NeuronService } from 'src/api/neuron/neuron.service';
import { Neuron } from 'src/api/neuron/neuron.entity';
import { Chain } from 'src/api/chain/chain.entity';
import { State } from 'src/api/state/state.entity';
import { StateItem } from 'src/api/state-item/state-item.entity';
import { Data } from 'src/api/data/data.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot(utilsFormatSqlConfig()),
		TypeOrmModule.forFeature([ 
			Neuron,
			Chain,
			State,
			StateItem,
			Data, 
		]),
		RedisModule.forRoot({
			config: [{
				namespace: 'Transport',
				host: process.env.REDIS_TRANSPORT_HOST,
				port: Number(process.env.REDIS_TRANSPORT_PORT),
				password: process.env.REDIS_TRANSPORT_PASSWORD,
				db: Number(process.env.REDIS_TRANSPORT_DB),
			}, {
				namespace: 'Cache',
				host: process.env.REDIS_CACHE_HOST,
				port: Number(process.env.REDIS_CACHE_PORT),
				password: process.env.REDIS_CACHE_PASSWORD,
				db: Number(process.env.REDIS_CACHE_DB),
			}, {
				namespace: 'Queue',
				host: process.env.REDIS_QUEUE_HOST,
				port: Number(process.env.REDIS_QUEUE_PORT),
				password: process.env.REDIS_QUEUE_PASSWORD,
				db: Number(process.env.REDIS_QUEUE_DB),
			}, {
				namespace: 'State',
				host: process.env.REDIS_STATE_HOST,
				port: Number(process.env.REDIS_STATE_PORT),
				password: process.env.REDIS_STATE_PASSWORD,
				db: Number(process.env.REDIS_STATE_DB),
			}],
		}),
		CacheModule,
	],
	controllers: [],
	providers: [ 
		CacheService, 
		NeuronService,
	],
})
export class AppModule {
}
