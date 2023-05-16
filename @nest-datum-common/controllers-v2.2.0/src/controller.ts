import {
	Exception,
	FailureException,
	MethodNotAllowedException,
} from '@nest-datum-common/exceptions';
import { strToObj as utilsFormatStrToObj } from '@nest-datum-utils/format';
import {
	exists as utilsCheckExists,
	strObj as utilsCheckStrObj,
	strArr as utilsCheckStrArr,
	strIdExists as utilsCheckStrIdExists,
	strDescription as utilsCheckStrDescription,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';

export class Controller {
	protected readonly serviceLog;

	async validateMany(options: object = {}) {
		const output = {};

		if (utilsCheckExists(options['select'])) {
			if (!utilsCheckStrObj(options['select']) 
				&& !utilsCheckStrArr(options['select'])) {
				throw new MethodNotAllowedException(`Property "select" is not valid.`);
			}
			output['select'] = utilsFormatStrToObj(options['select']);
		}
		if (utilsCheckExists(options['relations'])) {
			if (!utilsCheckStrObj(options['relations']) 
				&& !utilsCheckStrArr(options['relations'])) {
				throw new MethodNotAllowedException(`Property "relations" is not valid.`);
			}
			output['relations'] = utilsFormatStrToObj(options['relations']);
		}
		if (utilsCheckExists(options['sort'])) {
			if (!utilsCheckStrObj(options['sort']) 
				&& !utilsCheckStrArr(options['sort'])) {
				throw new MethodNotAllowedException(`Property "sort" is not valid.`);
			}
			output['sort'] = utilsFormatStrToObj(options['sort']);
		}
		if (utilsCheckExists(options['filter'])) {
			if (!utilsCheckStrObj(options['filter']) 
				&& !utilsCheckStrArr(options['filter'])) {
				throw new MethodNotAllowedException(`Property "filter" is not valid.`);
			}
			output['filter'] = utilsFormatStrToObj(options['filter']);
		}
		if (utilsCheckExists(options['query'])) {
			if (!utilsCheckStrDescription(options['query'])) {
				throw new MethodNotAllowedException(`Property "query" is not valid.`);
			}
			output['query'] = options['query'];
		}
		if (utilsCheckExists(options['page']) 
			&& !utilsCheckNumericInt(options['page'])) {
			throw new MethodNotAllowedException(`Property "page" is not valid.`);
		}
		if (utilsCheckExists(options['limit']) 
			&& !utilsCheckNumericInt(options['limit'])) {
			throw new MethodNotAllowedException(`Property "limit" is not valid.`);
		}
		output['page'] = options['page'] ?? 1;
		output['limit'] = options['limit'] ?? 20;
		
		return output;
	}

	async validateOne(options: object = {}) {
		if (!utilsCheckStrIdExists(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		const output = {
			id: options['id'],
		};

		if (utilsCheckExists(options['select'])) {
			if (!utilsCheckStrObj(options['select']) 
				&& !utilsCheckStrArr(options['select'])) {
				throw new MethodNotAllowedException(`Property "select" is not valid.`);
			}
			output['select'] = utilsFormatStrToObj(options['select']);
		}
		if (utilsCheckExists(options['relations'])) {
			if (!utilsCheckStrObj(options['relations']) 
				&& !utilsCheckStrArr(options['relations'])) {
				throw new MethodNotAllowedException(`Property "relations" is not valid.`);
			}
			output['relations'] = utilsFormatStrToObj(options['relations']);
		}
		return output;
	}

	async validateDrop(options: object = {}) {
		if (!utilsCheckStrIdExists(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		return {
			id: options['id'],
		};
	}

	async validateDropMany(options: object = {}) {
		if (!utilsCheckStrArr(options['ids'])) {
			throw new MethodNotAllowedException(`Property "ids" is not valid [1].`);
		}
		return {
			ids: JSON.parse(options['ids']),
		};
	}

	async validateCreate(options) {
		if (utilsCheckExists(options['id'])) {
			if (!utilsCheckStrIdExists(options['id'])) {
				throw new MethodNotAllowedException(`Property "id" is not valid.`);
			}
		}
		return {
			id: options['id'],
		};
	}

	async validateUpdate(options) {
		const output = {};

		if (utilsCheckExists(options['id'])) {
			if (!utilsCheckStrIdExists(options['id'])) {
				throw new MethodNotAllowedException(`Property "id" is not valid.`);
			}
			output['id'] = options['id'];
		}
		if (utilsCheckExists(options['newId'])) {
			if (!utilsCheckStrIdExists(options['newId'])) {
				throw new MethodNotAllowedException(`Property "newId" is not valid.`);
			}
			output['newId'] = options['newId'];
		}
		return output;
	}

	async serviceHandlerWrapperDefault() {
	}

	async serviceHandlerWrapper(callback = () => {}) {
		try {
			const output: any = callback
				? (await callback())
				: (await this.serviceHandlerWrapperDefault());

			if (output instanceof Exception) {
				throw new output['httpExceptionConstructor'](output.message);
			}
			else if (output instanceof Error) {
				throw new FailureException(output.message);
			}
			return output;
		}
		catch (err) {
			if (this.serviceLog) {
				this.serviceLog.create(err);
			}
			if (!(err instanceof Exception)) {
				throw new FailureException(err.message);
			}
			throw err;
		}
	}
}
