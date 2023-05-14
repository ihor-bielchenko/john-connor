import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { ManyService } from './many.service';
import { ManyTcpController } from './many-tcp.controller';

@Module({
	imports: [],
	controllers: [
		ManyTcpController,
	],
	providers: [ 
		ManyService,
	],
})
export class ManyTcpModule {
}
