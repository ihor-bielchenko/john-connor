import { 
	Get, 
	Delete,
	Param,
	Query,
	MethodNotAllowedException,
	UnauthorizedException,
} from '@nestjs/common';
import { strToObj as utilsFormatStrToObj } from '@nest-datum-utils/format';
import { func as utilsCheckFunc } from '@nest-datum-utils/check'; 
import { Controller } from './controller';

export class HttpController extends Controller {
	protected readonly service;

	@Get()
	async many(
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Query('page') page: number,
		@Query('limit') limit: number,
		@Query('query') query: string,
		@Query('filter') filter: string,
		@Query('sort') sort: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => {
			const output = await this.service.many(await this.validateMany({
				select,
				relations,
				page,
				limit,
				query,
				filter,
				sort,
			}));

			return { rows: (output['rows'] ?? output[0]), total: (output['total'] ?? output[1]) };
		});
	}

	@Get(':id')
	async one(
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Param('id') id: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.service.one(await this.validateOne({
			select,
			relations,
			id,
		})));
	}

	@Delete(':id')
	async drop(
		@Param('id') id: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.drop(await this.validateDrop({
			id,
		})));
	}

	@Delete()
	async dropMany(
		@Query('ids') ids: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.service.dropMany(await this.validateDropMany({
			ids,
		})));
	}

	async serviceHandlerWrapper(callback = () => {}) {
		try {
			return await super.serviceHandlerWrapper(callback);
		}
		catch (err) {
			if (utilsCheckFunc(err['getHttp'])) {
				const Exception = err['getHttp']();

				throw new Exception(err.message);
			}
			throw err;
		}
	}
}
