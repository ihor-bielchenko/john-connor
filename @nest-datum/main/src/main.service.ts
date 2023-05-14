import { Injectable } from '@nestjs/common';
import { 
	obj as utilsCheckObj,
	objQueryRunner as utilsCheckObjQueryRunner, 
} from '@nest-datum-utils/check';
import { FuseService } from '@nest-datum/fuse';

@Injectable()
export class MainService extends FuseService {
	protected readonly enableTransactions: boolean = false;
	protected readonly queryRunner;
	protected readonly connection;
	protected readonly repository;
	protected readonly repositoryConstructor;
	protected readonly repositoryBindOption;
	protected readonly repositoryBindOptionConstructor;
	protected readonly mainRelationColumnName: string;
	protected readonly optionRelationColumnName: string;

	protected async findMany({ page = 1, limit = 20, query, filter, sort, relations }: { page?: number; limit?: number; query?: string; filter?: object; sort?: object; relations?: object }): Promise<any> {
		if (utilsCheckObj(filter) && utilsCheckObj(filter['custom'])) {
			const optionId = filter['custom']['disableForOption'];
			const queryRunner = await this.connection.createQueryRunner();
			
			const types = await queryRunner.query(`SELECT ${this.mainRelationColumnName} FROM ${this.repositoryBindOption.metadata.tableName} WHERE ${this.optionRelationColumnName} = '${optionId}' GROUP BY ${this.mainRelationColumnName}`);

			delete filter['custom'];

			if (types.length > 0) {
				filter['id'] = [ '$Not', '$In', ...types.map((item) => item[this.mainRelationColumnName]) ];
			}
		}
		return await super.findMany({ page, limit, query, filter, sort, relations });
	}

	protected async dropProcessForever(id): Promise<any> {
		if (utilsCheckObjQueryRunner(this.queryRunner) && this.enableTransactions === true) {
			await this.queryRunner.manager.delete(this.repositoryBindOptionConstructor, { [this.mainRelationColumnName]: id });
			await this.queryRunner.manager.delete(this.repositoryConstructor, id);

			return true;
		}
		await this.repositoryBindOption.delete({ [this.mainRelationColumnName]: id });
		await this.repository.delete({ id });

		return true;
	}
}
