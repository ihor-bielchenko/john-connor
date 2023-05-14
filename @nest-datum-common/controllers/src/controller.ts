import {
	Exception,
	FailureException,
	MethodNotAllowedException,
	UnauthorizedException,
} from '@nest-datum-common/exceptions';
import { strToObj as utilsFormatStrToObj } from '@nest-datum-utils/format';
import {
	func as utilsCheckFunc,
	obj as utilsCheckObj,
	objFilled as utilsCheckObjFilled,
	arrFilled as utilsCheckArrFilled,
	exists as utilsCheckExists,
	bool as utilsCheckBool,
	strId as utilsCheckStrId,
	strArr as utilsCheckStrArr,
	strName as utilsCheckStrName,
	strDescription as utilsCheckStrDescription,
	strRegex as utilsCheckStrRegex,
	strType as utilsCheckStrType,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';

export class Controller {
	protected readonly serviceLog;

	async validateMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);
		const output = {
			accessToken: options['accessToken'],
			userId: user['id'],
		};

		if (utilsCheckExists(options['select'])) {
			if (!utilsCheckObjFilled(options['select']) && !utilsCheckArrFilled(options['select'])) {
				throw new MethodNotAllowedException(`Property "select" is not valid.`);
			}
			output['select'] = utilsFormatStrToObj(options['select']);
		}
		if (utilsCheckExists(options['relations'])) {
			if (!utilsCheckObjFilled(options['relations']) && !utilsCheckArrFilled(options['relations'])) {
				throw new MethodNotAllowedException(`Property "relations" is not valid.`);
			}
			output['relations'] = utilsFormatStrToObj(options['relations']);
		}
		if (utilsCheckExists(options['sort'])) {
			if (!utilsCheckObjFilled(options['sort']) && !utilsCheckArrFilled(options['sort'])) {
				throw new MethodNotAllowedException(`Property "sort" is not valid.`);
			}
			output['sort'] = utilsFormatStrToObj(options['sort']);
		}
		if (utilsCheckExists(options['filter'])) {
			if (!utilsCheckObjFilled(options['filter']) && !utilsCheckArrFilled(options['filter'])) {
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
		if (utilsCheckExists(options['page']) && !utilsCheckNumericInt(options['page'])) {
			throw new MethodNotAllowedException(`Property "page" is not valid.`);
		}
		if (utilsCheckExists(options['limit']) && !utilsCheckNumericInt(options['limit'])) {
			throw new MethodNotAllowedException(`Property "limit" is not valid.`);
		}
		output['page'] = options['page'] ?? 1;
		output['limit'] = options['limit'] ?? 20;
		
		return output;
	}

	async validateOne(options: object = {}) {
		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);
		const output = {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
		};

		if (utilsCheckExists(options['select'])) {
			if (!utilsCheckObjFilled(options['select']) && !utilsCheckArrFilled(options['select'])) {
				throw new MethodNotAllowedException(`Property "select" is not valid.`);
			}
			output['select'] = utilsFormatStrToObj(options['select']);
		}
		if (utilsCheckExists(options['relations'])) {
			if (!utilsCheckObjFilled(options['relations']) && !utilsCheckArrFilled(options['relations'])) {
				throw new MethodNotAllowedException(`Property "relations" is not valid.`);
			}
			output['relations'] = utilsFormatStrToObj(options['relations']);
		}
		return output;
	}

	async validateDrop(options: object = {}) {
		if (!utilsCheckStrId(options['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);

		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			id: options['id'],
		};
	}

	async validateDropMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);
		
		if (!utilsCheckStrArr(options['ids'])) {
			throw new MethodNotAllowedException(`Property "ids" is not valid [1].`);
		}
		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			ids: JSON.parse(options['ids']),
		};
	}

	async validateCreate(options) {
		return await this.validateUpdate(options);
	}

	async validateUpdate(options) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		delete options['user'];

		const user = getUser(options['accessToken']);
		const output = {};

		if (utilsCheckExists(options['id'])) {
			if (!utilsCheckStrId(options['id'])) {
				throw new MethodNotAllowedException(`Property "id" is not valid.`);
			}
			output['id'] = options['id'];
		}
		if (utilsCheckExists(options['newId'])) {
			if (!utilsCheckStrId(options['newId'])) {
				throw new MethodNotAllowedException(`Property "newId" is not valid.`);
			}
			output['newId'] = options['newId'];
		}
		if (utilsCheckExists(options['isNotDelete'])) {
			if (!utilsCheckBool(options['isNotDelete'])) {
				throw new MethodNotAllowedException(`Property "isNotDelete" is not valid.`);
			}
			output['isNotDelete'] = options['isNotDelete'];
		}
		if (utilsCheckExists(options['isDeleted'])) {
			if (!utilsCheckBool(options['isDeleted'])) {
				throw new MethodNotAllowedException(`Property "isDeleted" is not valid.`);
			}
			output['isDeleted'] = options['isDeleted'];
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
