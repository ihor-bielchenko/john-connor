import { Module } from '@nestjs/common';
import { BindService } from './bind.service';
import { BindTcpController } from './bind-tcp.controller';

@Module({
	imports: [],
	controllers: [
		BindTcpController,
	],
	providers: [ 
		BindService
	],
})
export class BindTcpModule {
}
