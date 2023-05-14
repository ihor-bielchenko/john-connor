import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ 
		DiskService, 
	],
})
export class DiskModule {
}
