import { Injectable } from '@nestjs/common';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { strId as utilsCheckStrId } from '@nest-datum-utils/check';
import { FuseService } from '@nest-datum/fuse';
import { objQueryRunner as utilsCheckObjQueryRunner } from '@nest-datum-utils/check';

@Injectable()
export class ManyService extends FuseService {
	protected readonly mainRelationColumnName: string;
	protected readonly optionRelationColumnName: string;
	protected readonly optionContentColumnName: string;
	protected readonly repositoryCache;
	protected readonly repositoryConstructor;
	protected readonly repository;
	protected readonly repositoryOptionConstructor;
	protected readonly repositoryOption;
	protected readonly repositoryContentOptionConstructor;
	protected readonly repositoryContentOption;
	public readonly contentManyService;
	protected readonly connection;

	protected async dropProcessForever(id): Promise<any> {
		this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
		this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id } ] });

		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.manager.delete(this.repositoryOptionConstructor, { [this.optionRelationColumnName]: id });
			await this.queryRunner.manager.delete(this.repositoryConstructor, id);

			return true;
		}
		await this.repositoryOption.delete({ [this.optionRelationColumnName]: id });
		await this.repository.delete({ id });

		return true;
	}

	public async content(payload: object): Promise<any> {
		await this.contentBefore(payload);

		const processedPayload = await this.contentProperties(payload);
		let i = 0,
			ii = 0,
			output = [],
			ids = new Set,
			parentIds = new Set;

		while (i < processedPayload['data'].length) {
			if (processedPayload['data'][i]) {
				ii = 0;

				const option = processedPayload['data'][i];

				while (ii < option.length) {
					ids.add(option[ii]['id']);
					if (option[ii]['parentId']) {
						parentIds.add(option[ii]['parentId']);
					}
					ii++;
				}
			}
			i++;
		}
		const idsArr = Array.from(ids);
		const parentIdsArr = Array.from(parentIds);

		const conditionIds = idsArr.map((id, index) => `id = '${id}'${(idsArr.length - 1 > index) ? ' OR ' : ''}`).join('');
		const conditionParentIds = parentIdsArr.map((id, index) => `parentId = '${id}'${(parentIdsArr.length - 1 > index) ? ' OR ' : ''}`).join('');

		const condition = (parentIdsArr.length > 0)
			? `(${conditionIds}) AND (${conditionParentIds})`
			: `${this.mainRelationColumnName} = '${payload['id']}'`;

		(utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.query(`DELETE FROM ${this.repositoryContentOption.metadata.tableName} WHERE ${condition}`)
			: await this.connection.query(`DELETE FROM ${this.repositoryContentOption.metadata.tableName} WHERE ${condition}`);

		i = 0;
		ii = 0;

		while (i < processedPayload['data'].length) {
			ii = 0;

			const option = processedPayload['data'][i];

			while (ii < option.length) {
				const {
					entityId,
					entityOptionId,
					withNewId,
					...optionData
				} = option[ii];

				if (withNewId === true) {
					delete optionData['id'];
				}
				output.push(await this.contentProcess({
					...optionData,
					content: String(optionData['content'] ?? ''),
					[this.mainRelationColumnName]: entityId,
					[this.optionContentColumnName]: entityOptionId,
				}));
				ii++;
			}
			i++;
		}
		return await this.contentOutput(payload, await this.contentAfter(payload, processedPayload, output));
	}

	protected async contentProperties(payload: object): Promise<any> {
		return payload;
	}

	protected async contentBefore(payload: object): Promise<any> {
		return this.before(payload);
	}

	protected async contentProcess(payload: object): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.save(Object.assign(new this.repositoryContentOptionConstructor(), payload))
			: await this.repositoryContentOption.save({ ...payload });
	}

	protected async contentAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async contentOutput(payload: object, data: any): Promise<object> {
		return data;
	}

	public async contentUpdate(payload: object = {}): Promise<object> {
		await this.contentUpdateBefore(payload);

		const processedPayload = await this.contentUpdateProperties(payload);
		const output = await this.contentUpdateProcess(payload['id'], processedPayload, payload);

		return await this.contentUpdateOutput(processedPayload, await this.contentUpdateAfter(payload, processedPayload, output));
	}

	protected async contentUpdateBefore(payload: object): Promise<any> {
		return await super.createBefore(payload);
	}

	protected async contentUpdateProperties(payload: object): Promise<object> {
		if (payload['newId'] && !utilsCheckStrId(payload['newId'])) {
			throw new MethodNotAllowedException(`Property "newId" is not valid.`);
		}
		return await super.updateProperties({ ...payload });
	}

	protected async contentUpdateProcess(id: string, processedPayload: object, payload: object): Promise<object> {
		if (processedPayload['newId']) {
			processedPayload['id'] = processedPayload['newId'];

			delete processedPayload['newId'];
		}
		if (this.withCache === true) {
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id } ] });
		}
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.update(this.repositoryContentOptionConstructor, id, processedPayload)
			: await this.repositoryContentOption.update({ id }, processedPayload);
	}

	protected async contentUpdateAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await super.after(initialPayload, processedPayload, data);
	}

	protected async contentUpdateOutput(payload: object, data: any): Promise<object> {
		return await super.updateOutput(payload, data);
	}
}
