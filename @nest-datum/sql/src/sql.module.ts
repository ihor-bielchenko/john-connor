import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { SqlService } from './sql.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ 
		ModelService,
		SqlService, 
	],
})
export class SqlModule {
}
