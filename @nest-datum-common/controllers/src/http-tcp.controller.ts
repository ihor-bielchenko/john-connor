import { 
	Get, 
	Delete,
	Post,
	Patch,
	Body,
	Param,
	Query,
} from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { HttpController } from './http.controller';

export class HttpTcpController extends HttpController {
	protected readonly transport;
	protected readonly serviceName;
	protected readonly entityName;

	async validateCreate(options) {
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		return { ...await super.validateUpdate(options), accessToken: options['accessToken'] };
	}

	@Get()
	async many(
		@AccessToken() accessToken: string,
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
				accessToken,
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
		@AccessToken() accessToken: string,
		@Query('select') select: string,
		@Query('relations') relations: string,
		@Param('id') id: string,
	): Promise<any> {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.one`,
		}, await this.validateOne({
			accessToken,
			select,
			relations,
			id,
		})));
	}

	@Delete(':id')
	async drop(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.drop`,
		}, await this.validateDrop({
			accessToken,
			id,
		})));
	}

	@Delete()
	async dropMany(
		@AccessToken() accessToken: string,
		@Query('ids') ids: string,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.dropMany`,
		}, await this.validateDropMany({
			accessToken,
			ids,
		})));
	}
}
