import { 
	Exception,
	FailureException, 
	UnauthorizedException,
	MethodNotAllowedException,
} from '@nest-datum-common/exceptions';
import { 
	checkToken,
	getUser, 
} from '@nest-datum-common/jwt';
import { arrFilled as utilsCheckArrFilled } from '@nest-datum-utils/check';
import { Controller } from './controller';

export class TcpController extends Controller {
	protected readonly service;

	async validateDropMany(options: object = {}) {
		if (!checkToken(options['accessToken'], process.env.JWT_SECRET_ACCESS_KEY)) {
			throw new UnauthorizedException(`User is undefined or token is not valid.`);
		}
		const user = getUser(options['accessToken']);
		
		if (!utilsCheckArrFilled(options['ids'])) {
			throw new MethodNotAllowedException(`Property "ids" is not valid [1].`);
		}
		return {
			accessToken: options['accessToken'],
			userId: user['id'],
			ids: options['ids'],
		};
	}

	async many(payload) {
		return await this.serviceHandlerWrapper(async () => {
			const output = await this.service.many(await this.validateMany(payload));

			return { rows: (output['rows'] ?? output[0]), total: (output['total'] ?? output[1]) };
		});
	}

	async one(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.one(await this.validateOne(payload)));
	}

	async drop(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.drop(await this.validateDrop(payload)));
	}

	async dropMany(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.dropMany(await this.validateDropMany(payload)));
	}

	async create(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.create(await this.validateCreate(payload)));
	}

	async update(payload) {
		return await this.serviceHandlerWrapper(async () => await this.service.update(await this.validateUpdate(payload)));
	}

	async serviceHandlerWrapper(callback = () => {}) {
		try {
			const output: any = callback
				? (await callback())
				: (await this.serviceHandlerWrapperDefault());

			if (output instanceof Exception) {
				console.error(output);

				return new output['httpExceptionConstructor'](output.message);
			}
			else if (output instanceof Error) {
				console.error(output);

				return new FailureException(output.message);
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
			console.error(err);

			return {
				errorCode: err['errorCode'],
				message: err['message'],
			};
		}
	}
}
