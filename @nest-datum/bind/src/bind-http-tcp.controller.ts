import { 
	Delete,
	Post,
	Patch,
	Body,
	Param,
} from '@nestjs/common';
import { MethodNotAllowedException } from '@nestjs/common';
import { AccessToken } from '@nest-datum-common/decorators';
import { HttpTcpController } from '@nest-datum-common/controllers-v2.2.0';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';

export class BindHttpTcpController extends HttpTcpController {
	protected readonly mainRelationColumnName: string;
	protected readonly optionRelationColumnName: string;

	async validateCreate(options) {
		if (!utilsCheckStrId(options[this.mainRelationColumnName])) {
			throw new MethodNotAllowedException(`Property "${this.mainRelationColumnName}" is not valid.`);
		}
		if (!utilsCheckStrId(options[this.optionRelationColumnName])) {
			throw new MethodNotAllowedException(`Property "${this.optionRelationColumnName}" is not valid.`);
		}

		return {
			[this.mainRelationColumnName]: options[this.mainRelationColumnName],
			[this.optionRelationColumnName]: options[this.optionRelationColumnName],
			...await super.validateCreate(options),
		};
	}

	async validateUpdate(options) {
		if (!utilsCheckStrId(options[this.mainRelationColumnName])) {
			throw new MethodNotAllowedException(`Property "${this.mainRelationColumnName}" is not valid.`);
		}
		if (!utilsCheckStrId(options[this.optionRelationColumnName])) {
			throw new MethodNotAllowedException(`Property "${this.optionRelationColumnName}" is not valid.`);
		}
		return await super.validateUpdate(options);
	}

	@Post(':id')
	async create(
		@AccessToken() accessToken: string,
		@Param('id') entityId: string,
		@Body() body,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.create`,
		}, await this.validateCreate({
			accessToken,
			[this.mainRelationColumnName]: entityId,
			[this.optionRelationColumnName]: body[this.optionRelationColumnName],
		})));
	}

	@Patch(':id')
	async update(
		@AccessToken() accessToken: string,
		@Param('id') id: string,
		@Body() body,
	) {
		return await this.serviceHandlerWrapper(async () => await this.transport.send({
			name: this.serviceName, 
			cmd: `${this.entityName}.update`,
		}, await this.validateUpdate({
			accessToken,
			id,
			[this.mainRelationColumnName]: body[this.mainRelationColumnName],
			[this.optionRelationColumnName]: body[this.optionRelationColumnName],
		})));
	}
}
