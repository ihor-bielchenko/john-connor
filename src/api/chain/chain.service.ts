import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { 
	Repository,
	Connection, 
} from 'typeorm';
import { SqlService } from '@nest-datum/sql';
import { CacheService } from '@nest-datum/cache';
import { Chain } from './chain.entity';

@Injectable()
export class ChainService extends SqlService {
	protected readonly withEnvKey: boolean = false;
	protected readonly withTwoStepRemoval: boolean = false;
	protected readonly withCache: boolean = false;
	protected readonly repositoryConstructor = Chain;

	constructor(
		@InjectRepository(Chain) protected readonly repository: Repository<Chain>,
		protected readonly connection: Connection,
		protected readonly repositoryCache: CacheService,
	) {
		super();
	}

	protected manyGetColumns(customColumns: object = {}) {
		return ({
			...super.manyGetColumns(customColumns),
			parentId: true,
			neuronId: true,
			stateId: true,
			dataId: true,
			isTrue: true,
			isFortified: true,
		});
	}

	protected oneGetColumns(customColumns: object = {}): object {
		return ({
			...super.oneGetColumns(customColumns),
			parentId: true,
			neuronId: true,
			stateId: true,
			dataId: true,
			isTrue: true,
			isFortified: true,
		});
	}
}
