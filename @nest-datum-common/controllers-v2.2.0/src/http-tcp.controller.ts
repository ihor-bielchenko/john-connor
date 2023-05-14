import { 
	Get, 
	Delete,
	Param,
	Query,
} from '@nestjs/common';
import { HttpController } from './http.controller';

export class HttpTcpController extends HttpController {
	protected readonly transport;
	protected readonly serviceName;
	protected readonly entityName;

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
			const output = await this.transport.send({
				name: this.serviceName, 
				cmd: `${this.entityName}.many`,
			}, await this.validateMany({
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
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.one`,
		}, await this.validateOne({
			select,
			relations,
			id,
		})));
	}

	@Delete(':id')
	async drop(
		@Param('id') id: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.drop`,
		}, await this.validateDrop({
			id,
		})));
	}

	@Delete()
	async dropMany(
		@Query('ids') ids: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.dropMany`,
		}, await this.validateDropMany({
			ids,
		})));
	}
}
