import { Module } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';
import { MainService } from './main.service';
import { MainTcpController } from './main-tcp.controller';

@Module({
	imports: [
		MainTcpController,
	],
	controllers: [],
	providers: [ 
		MainService,
	],
})
export class MainTcpModule {
}
