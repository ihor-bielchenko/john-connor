import { 
	Controller,
	Post,
	Patch,
	Body,
	Param,
	UnauthorizedException,
	MethodNotAllowedException,
} from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { TransportService } from '@nest-datum/transport';
import { HttpTcpController } from '@nest-datum-common/controllers';
import { 
	exists as utilsCheckExists,
	strId as utilsCheckStrId,
} from '@nest-datum-utils/check';

@Controller(`${process.env.SERVICE_CV}/chain`)
export class ChainHttpTcpController extends HttpTcpController {
	protected readonly serviceName: string = process.env.SERVICE_CV;
	protected readonly entityName: string = 'chain';

	constructor(
		protected transport: TransportService,
	) {
		super();
	}
}
