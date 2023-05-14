import { TcpController } from '@nest-datum-common/controllers-v2.2.0';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';

export class BindTcpController extends TcpController {
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
}
