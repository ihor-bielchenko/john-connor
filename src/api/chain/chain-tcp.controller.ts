import { Controller } from '@nestjs/common';
import { 
	MessagePattern,
	EventPattern, 
} from '@nestjs/microservices';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { TcpController } from '@nest-datum-common/controllers';
import { ChainService } from './chain.service';

@Controller()
export class ChainTcpController extends TcpController {
	constructor(
		protected service: ChainService,
	) {
		super();
	}

	@MessagePattern({ cmd: 'chain.many' })
	async many(payload) {
		return await super.many(payload);
	}

	@MessagePattern({ cmd: 'chain.one' })
	async one(payload) {
		return await super.one(payload);
	}
}
