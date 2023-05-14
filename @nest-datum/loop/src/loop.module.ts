import { Module } from '@nestjs/common';
import { LoopService } from './loop.service';

@Module({
	controllers: [],
	imports: [],
	providers: [ 
		LoopService,
	],
})
export class LoopModule {
}
