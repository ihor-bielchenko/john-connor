import { Controller } from '@nestjs/common';
import { HttpController } from '@nest-datum-common/controllers';
import { ChainService } from './chain.service';

@Controller(`/chain`)
export class ChainHttpController extends HttpController {
	constructor(
		protected service: ChainService,
	) {
		super();
	}
}
