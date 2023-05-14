const deepmerge = require('deepmerge');

import { Injectable } from '@nestjs/common';
import {  
	Repository,
	Not,
	LessThan,
	LessThanOrEqual,
	MoreThan,
	MoreThanOrEqual,
	Equal,
	Like,
	ILike,
	Between,
	In,
	Any,
	IsNull,
} from 'typeorm';
import { 
	MethodNotAllowedException,
	NotFoundException, 
} from '@nest-datum-common/exceptions';
import { 
	arr as utilsCheckArr,
	arrFilled as utilsCheckArrFilled, 
	obj as utilsCheckObj,
	objFilled as utilsCheckObjFilled,
	objQueryRunner as utilsCheckObjQueryRunner,
	numericInt as utilsCheckNumericInt,
	strId as utilsCheckStrId,
	strArr as utilsCheckStrArr,
} from '@nest-datum-utils/check';
import { strToObj as utilsFormatStrToObj } from '@nest-datum-utils/format';
import { ModelService } from '@nest-datum/model';

@Injectable()
export class SqlService extends ModelService {
	private operators = {
		'$Not': Not,
		'$LessThan': LessThan,
		'$LessThanOrEqual': LessThanOrEqual,
		'$MoreThan': MoreThan,
		'$MoreThanOrEqual': MoreThanOrEqual,
		'$Equal': Equal,
		'$Like': Like,
		'$ILike': ILike,
		'$Between': Between,
		'$In': In,
		'$Any': Any,
		'$IsNull': IsNull,
	};
	protected queryRunner;
	protected readonly connection;
	protected readonly enableTransactions: boolean = false;
	protected readonly withCache: boolean = false;
	protected readonly withEnvKey: boolean = false;
	protected readonly repositoryCache;
	protected readonly repositoryConstructor;
	protected readonly repository;

	protected async createQueryRunnerManager(): Promise<any> {
		return (this.queryRunner = await this.connection.createQueryRunner());
	}

	protected async startQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.startTransaction();
		}
	}

	protected async commitQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.commitTransaction();
		}
	}

	protected async rollbackQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.rollbackTransaction();
		}
	}

	protected async dropQueryRunnerManager(): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.release();
			this.queryRunner = undefined;
		}
		return true;
	}

	protected manyGetColumns(customColumns: object = {}): object {
		return { id: true, ...this.withEnvKey ? { envKey: true } : {} };
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return { id: true, ...this.withEnvKey ? { envKey: true } : {} };
	}

	protected manyGetQueryColumns(customColumns: object = {}): object {
		return { ...this.withEnvKey ? { envKey: true } : {} };
	}

	protected where(filter: object = {}, where: object = {}): object {
		let key;

		for (key in filter) {
			let i = 0,
				filterKey = key,
				filterValue = filter[key];

			if (utilsCheckArr(filterValue)) {
				where[filterKey] = (this.operators[filterValue[0]])
					? this.operators[filterValue[0]]((this.operators[filterValue[1]])
						? this.operators[filterValue[1]](filterValue.slice(2))
						: filterValue.slice(1))
					: filterValue;
			}
			else if (utilsCheckObj(filterValue)) {
				where[filterKey] = this.where(filterValue);
			}
			else {
				where[filterKey] = filterValue;
			}
		}
		return where;
	}

	protected query(query: string = '', querySelect = {}, where = []): any {
		let key;

		for (key in querySelect) {
			(utilsCheckArr(where))
				? where.push({ 
					[key]: utilsCheckObjFilled(querySelect[key])
						? this.query(querySelect[key], query)
						: Like(`%${query}%`), 
				})
				: (where[key] = utilsCheckObjFilled(querySelect[key])
					? this.query(query, querySelect[key])
					: Like(`%${query}%`));
		}
		return where;
	}

	protected relationsByFilter(filter: object = {}, collect: object = {}) {
		let key;

		for (key in filter) {
			let i = 0,
				filterKey = key,
				filterValue = filter[key];

			if (utilsCheckObj(filterValue)) {
				let childKey,
					childFlag = false;

				for (childKey in filterValue) {
					if (utilsCheckObj(filterValue[childKey])) {
						childFlag = true;
						break;
					}
				}
				collect[filterKey] = childFlag
					? this.relationsByFilter(filterValue)
					: true;
			}
		}
		return collect;
	}

	protected relations(data?: object, filter: object = {}): object {
		const relationsByFilter = this.relationsByFilter(filter);

		if (utilsCheckObj(data)) {
			return deepmerge(relationsByFilter || {}, data);
		}
		return relationsByFilter;
	}

	protected pagination(page: number, limit: number): object {
		const limitProcessed = utilsCheckNumericInt(limit) ? limit : 0;

		const skip = (page > 0)
			? ((page - 1) * limitProcessed)
			: 0;

		return {
			skip,
			...utilsCheckNumericInt(limitProcessed)
				? { take: limitProcessed }
				: {},
		};
	}

	protected order(sort: object = {}): object {
		return utilsCheckObjFilled(sort)
			? sort
			: (this.manyGetColumns()['createdAt']
				? { createdAt: 'DESC' }
				: {});
	}

	protected async findMany({ page = 1, limit = 20, query, filter, sort, relations }: { page?: number; limit?: number; query?: string; filter?: object; sort?: object; relations?: object }): Promise<any> {
		const relationsProcessed = this.relations(relations, filter);
		const whereProcessed = this.where(filter);
		const order = this.order(sort);
		let where;

		if (query) {
			where = this.query(query, this.manyGetQueryColumns());
			where = where.map((item) => ({
				...item,
				...whereProcessed,
			}));
		}
		return {
			select: this.manyGetColumns(),
			...utilsCheckObjFilled(relationsProcessed)
				? { relations: relationsProcessed }
				: {},
			...(utilsCheckArrFilled(where)
				|| utilsCheckObjFilled(whereProcessed))
				? { where: where || whereProcessed }
				: {},
			...utilsCheckObjFilled(order)
				? { order }
				: {},
			...this.pagination(page, limit),
		};
	}

	protected async findOne(options?: object): Promise<any> {
		const id = options['id'];
		const relations = options['relations'];
		const filter = { id };
		const relationsProcessed = this.relations(relations, filter);
		const where = this.where(filter);

		return {
			select: this.oneGetColumns(),
			...(Object.keys(relationsProcessed).length > 0)
				? { relations: relationsProcessed }
				: {},
			...(Object.keys(where).length > 0)
				? { where }
				: {},
		};
	}

	protected async manyProcess(processedPayload: object, payload: object): Promise<Array<Array<any> | number>> {
		if (this.withCache === true) {
			const cachedData = await this.repositoryCache.one({ key: [ this.prefix(process.env.APP_NAME), 'many', processedPayload ] });

			if (cachedData) {
				return cachedData;
			}
		}
		const condition = await this.findMany(processedPayload);
		const output = await this.repository.findAndCount(condition);

		if (this.withCache === true) {
			await this.repositoryCache.create({ key: [ this.prefix(process.env.APP_NAME), 'many', processedPayload ], output });
		}
		return output;
	}

	protected async oneProperties(payload: object): Promise<object> {
		if (payload['id'] && !utilsCheckStrId(payload['id'])) {
			throw new MethodNotAllowedException(`Property "id" is not valid.`);
		}
		return { ...payload };
	}

	protected async oneProcess(processedPayload: object, payload: object): Promise<any> {
		if (this.withCache === true) {
			const cachedData = await this.repositoryCache.one({ key: [ this.prefix(process.env.APP_NAME), 'one', { id: processedPayload['id'] } ] });

			if (cachedData) {
				return cachedData;
			}
		}
		const output = await this.repository.findOne(await this.findOne(processedPayload));

		if (output && this.withCache === true) {
			await this.repositoryCache.create({ key: [ this.prefix(process.env.APP_NAME), 'one', { id: processedPayload['id'] } ], output });
		}
		if (!output) {
			return new NotFoundException('Entity is undefined.');
		}
		return output;
	}

	protected async createBefore(payload: object): Promise<any> {
		if (this.enableTransactions === true) {
			await this.createQueryRunnerManager();
			await this.startQueryRunnerManager();
			
			try {
				return await this.before(payload);
			}
			catch (err) {
				await this.rollbackQueryRunnerManager();

				throw err;
			}
			finally {
				await this.dropQueryRunnerManager();
			}
		}
		return await this.before(payload);
	}

	protected async createProperties(payload: object): Promise<object> {
		if (this.enableTransactions === true) {
			try {
				return await super.createProperties({ ...payload });
			}
			catch (err) {
				await this.rollbackQueryRunnerManager();

				throw err;
			}
			finally {
				await this.dropQueryRunnerManager();
			}
		}
		return await super.createProperties({ ...payload });
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		try {
			if (this.withCache === true) {
				this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
			}
			return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
				? await this.queryRunner.manager.save(Object.assign(new this.repositoryConstructor(), processedPayload))
				: await this.repository.save(processedPayload);
		}
		catch (err) {
			await this.rollbackQueryRunnerManager();

			throw err;
		}
		finally {
			await this.dropQueryRunnerManager();
		}
	}

	protected async after(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			try {
				await this.commitQueryRunnerManager();

				return await super.after(initialPayload, processedPayload, data);
			}
			catch (err) {
				await this.rollbackQueryRunnerManager();

				throw err;
			}
			finally {
				await this.dropQueryRunnerManager();
			}
		}
		return await super.after(initialPayload, processedPayload, data);
	}

	protected async updateBefore(payload: object): Promise<any> {
		return await this.createBefore(payload);
	}

	protected async updateProperties(payload: object): Promise<object> {
		if (payload['newId'] && !utilsCheckStrId(payload['newId'])) {
			throw new MethodNotAllowedException(`Property "newId" is not valid.`);
		}
		return await super.updateProperties({ ...payload });
	}

	protected async updateProcess(id: string, processedPayload: object, payload: object): Promise<object> {
		if (processedPayload['newId']) {
			processedPayload['id'] = processedPayload['newId'];

			delete processedPayload['newId'];
		}
		if (this.withCache === true) {
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id } ] });
		}
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.update(this.repositoryConstructor, id, processedPayload)
			: await this.repository.update({ id }, processedPayload);
	}

	protected async updateAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async dropBefore(payload: object): Promise<any> {
		return await this.createBefore(payload);
	}

	protected async dropProperties(payload): Promise<object> {
		return await super.oneProperties({ ...payload });
	}

	protected async dropProcess(processedPayload: object | string, payload: object): Promise<any> {		
		const id = utilsCheckObj(processedPayload)
			? String((processedPayload || {})['id'])
			: String(processedPayload);

		if (this.withCache === true) {
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id } ] });
		}
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.delete(this.repositoryConstructor, id)
			: await this.repository.delete({ id });
	}

	protected async dropAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}

	protected async dropManyBefore(payload: object): Promise<any> {
		return await this.createBefore(payload);
	}

	protected async dropManyProperties(payload): Promise<object> {
		if (!utilsCheckArr(payload['ids'])) {
			throw new MethodNotAllowedException(`Property "ids" is not valid.`);
		}
		return payload['ids'];
	}

	protected async dropManyProcess(processedPayload: Array<string>, payload: object): Promise<any> {
		if (this.withCache === true) {
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });

			let i = 0;

			while (i < processedPayload['ids'].length) {
				this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id: processedPayload['ids'][i] } ] });
				i++;
			}
		}
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.delete(this.repositoryConstructor, processedPayload['ids'])
			: await this.repository.delete(processedPayload['ids']);
	}

	protected async dropManyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any> {
		return await this.after(initialPayload, processedPayload, data);
	}
}
