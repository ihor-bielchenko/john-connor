import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TransportService } from './transport.service';

@Module({
	imports: [
		RedisModule.forRoot({
			config: {
				namespace: 'Transport',
				host: process.env.REDIS_TRANSPORT_HOST,
				port: Number(process.env.REDIS_TRANSPORT_PORT),
				password: process.env.REDIS_TRANSPORT_PASSWORD,
				db: Number(process.env.REDIS_TRANSPORT_DB),
			},
		}),
	],
	controllers: [],
	providers: [ 
		TransportService, 
	],
})
export class TransportModule {
}
