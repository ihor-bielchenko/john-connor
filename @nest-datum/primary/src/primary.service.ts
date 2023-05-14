import { Injectable } from '@nestjs/common';
import { SqlService } from '@nest-datum/sql';

@Injectable()
export class PrimaryService extends SqlService {
	private defultSort: object = { createdAt: 'DESC' };

	public setDefaultSort(sortObj: object) {
		return (this.defultSort = sortObj);
	}

	protected manyGetColumns(customColumns: object = {}): object {
		return {
			...super.manyGetColumns(customColumns),
			createdAt: true,
			updatedAt: true,
		};
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return {
			...super.oneGetColumns(customColumns),
			createdAt: true,
			updatedAt: true,
		};
	}

	protected async manyProperties(payload): Promise<object> {
		if (!payload['sort'] && this.manyGetColumns()['createdAt']) {
			payload['sort'] = this.defultSort;
		}
		return payload;
	}

	protected async createProperties(payload: object): Promise<object> {
		delete payload['accessToken'];
		delete payload['refreshToken'];

		return await super.createProperties(payload);
	}

	protected async updateProperties(payload: object): Promise<object> {
		delete payload['accessToken'];
		delete payload['refreshToken'];

		return await super.updateProperties(payload);
	}
}
