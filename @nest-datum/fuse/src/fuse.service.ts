import { Injectable } from '@nestjs/common';
import { 
	objFilled as utilsCheckObjFilled,
	objQueryRunner as utilsCheckObjQueryRunner, 
	bool as utilsCheckBool,
} from '@nest-datum-utils/check';
import { loopAsync as utilsLoopAsync } from '@nest-datum-utils/loop';
import { PrimaryService } from '@nest-datum/primary';

@Injectable()
export class FuseService extends PrimaryService {
	protected readonly enableTransactions: boolean = false;
	protected readonly queryRunner;
	protected readonly connection;
	protected readonly repository;
	protected readonly repositoryConstructor;
	protected readonly withCache: boolean = false;
	protected readonly repositoryCache;
	protected readonly withTwoStepRemoval: boolean = false;
	protected readonly withEnvKey: boolean = true;

	protected manyGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			isDeleted: true,
			isNotDelete: true,
		};
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			isDeleted: true,
			isNotDelete: true,
		};
	}

	protected async dropProcess(processedPayload: object | string, payload: object): Promise<any> {
		const id = utilsCheckObjFilled(processedPayload)
			? String((processedPayload || {})['id'])
			: String(processedPayload);

		if (this.withCache === true) {
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
			this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id } ] });
		}
		if (!this.withTwoStepRemoval) {
			return await this.dropProcessForever(id);
		}
		const entity = (utilsCheckObjFilled(processedPayload) && utilsCheckBool(processedPayload['isDeleted']))
			? processedPayload
			: (await this.repository.findOne({
				select: {
					id: true,
					isDeleted: true,
				},
				where: {
					id,
				},
			}));
		
		entity.isDeleted
			? await this.dropProcessForever(id)
			: await this.dropProcessPrepare(id);

		return entity;
	}

	protected async dropManyProcess(processedPayload: Array<string>, payload: object): Promise<any> {
		if (!this.withTwoStepRemoval) {
			if (this.withCache === true) {
				this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
				this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', '*' ] });
			}
			return await this.dropManyProcessForever(processedPayload);
		}
		return await utilsLoopAsync(processedPayload, (async (id) => {
			if (this.withCache === true) {
				this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'many', '*' ] });
				this.repositoryCache.drop({ key: [ this.prefix(process.env.APP_NAME), 'one', { id } ] });
			}
			const entity = await this.repository.findOne({
				select: {
					id: true,
					isDeleted: true,
				},
				where: {
					id,
				},
			});

			return entity.isDeleted
				? await this.dropProcessForever(entity.id)
				: await this.dropProcessPrepare(entity.id);
		}));
	}

	protected async dropProcessForever(id): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.delete(this.repositoryConstructor, id)
			: await this.connection.query(`DELETE FROM ${this.repository.metadata.tableName} WHERE id = "${id}";`);
	}

	protected async dropProcessPrepare(id: string): Promise<any> {
		return (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true)
			? await this.queryRunner.manager.save(Object.assign(new this.repositoryConstructor(), { id, isDeleted: true }))
			: await this.repository.save({ id, isDeleted: true });
	}
}
