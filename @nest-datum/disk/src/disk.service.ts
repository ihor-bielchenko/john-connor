import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { ModelService } from '@nest-datum/model';

@Injectable()
export class DiskService extends ModelService {
	protected uniqueName(defaultName?: string): string {
		return defaultName ? `(${uuidv4()})-${defaultName}` : uuidv4();
	}
}
