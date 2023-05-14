import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
	controllers: [],
	imports: [],
	providers: [ 
		CacheService, 
	],
})
export class CacheModule {
}
