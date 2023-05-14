import { Module } from '@nestjs/common';
import { FuseService } from './fuse.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ 
		FuseService, 
	],
})
export class FuseModule {
}
