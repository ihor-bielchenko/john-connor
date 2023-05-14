
import { Controller } from './controller';

export class TcpController extends Controller {
	protected readonly service;

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
}
