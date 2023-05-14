const fs = require('fs/promises');

import { Injectable } from '@nestjs/common';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { LocalService } from './local.service';

@Injectable()
export class FolderService extends LocalService {
	public async createProcess(processedPayload: object, payload: object): Promise<Array<any>> {
		const destinationPath = this.path(processedPayload['path']);

		if (await this.exists(destinationPath)) {
			if (!processedPayload['force']) {
				throw new MethodNotAllowedException(`Folder "${destinationPath}" already exists.`);
			}
		}
		await fs.mkdir(destinationPath, { recursive: true });
		
		if (processedPayload['chmod']) {
			await fs.chmod(destinationPath, processedPayload['chmod']);
		}
		return [];
	}
}
