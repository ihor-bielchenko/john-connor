import { Module } from '@nestjs/common';
import { ModelService } from './model.service';

@Module({
	imports: [],
	controllers: [],
	providers: [ ModelService ],
})
export class ModelModule {
}
