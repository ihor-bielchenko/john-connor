import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { sqlConfig as utilsFormatSqlConfig } from '@nest-datum-utils/format';
import { NeuronTcpModule } from './api/neuron/neuron-tcp.module';
import { ChainTcpModule } from './api/chain/chain-tcp.module';
import { AppController } from './app.controller';

@Module({
	imports: [
		TypeOrmModule.forRoot(utilsFormatSqlConfig()),
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
			}],
		}),
		NeuronTcpModule,
		ChainTcpModule,
	],
	controllers: [ AppController ],
	providers: [],
})
export class AppModule {
}
