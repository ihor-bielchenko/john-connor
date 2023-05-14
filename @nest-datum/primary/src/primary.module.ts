import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from '@nest-datum/sql';
import { PrimaryService } from './primary.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ 
		ModelService,
		SqlService,
		PrimaryService, 
	],
})
export class PrimaryModule {
}
