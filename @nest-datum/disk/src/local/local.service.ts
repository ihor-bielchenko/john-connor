const fs = require('fs/promises');

import { fileTypeFromFile } from 'file-type';
import { Injectable } from '@nestjs/common';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import {
	exists as utilsCheckExists,
	func as utilsCheckFunc,
	arrFilled as utilsCheckArrFilled,
	strFileName as utilsCheckStrFileName,
	strFilled as utilsCheckStrFilled,
	bool as utilsCheckBool,
} from '@nest-datum-utils/check';
import { DiskService } from '../disk.service';

@Injectable()
export class LocalService extends DiskService {
	public nameByPath(paht: string): string {
		const pahtSplit = paht.split('/');

		return pahtSplit[pahtSplit.length - 1];
	}

	public path(section: string, newName?: string, withoutCore: boolean = false): string {
		const output = `${!withoutCore ? process.env.PATH_ROOT : ''}/${section
			.replace(/[^a-zA-Zа-я 0-9-',.!?"()@$:;+=&%\\]+/, '')
			.replace(/[^a-zA-Zа-я 0-9-',.!?"()@$:;+=&%\\]+$/, '')}`;

		if (newName) {
			const outputSplit = output.split('/');

			outputSplit[outputSplit.length - 1] = newName;

			return outputSplit.join('/');
		}
		return output;
	}

	public async exists(path: string): Promise<boolean> {
		try {
			await fs.stat(path);
			return true;
		}
		catch {
		}
		return false;
	}

	public async manyProperties(payload): Promise<object> {
		if (!utilsCheckStrFilled(payload['path'])) {
			throw new MethodNotAllowedException(`Property "path" is not valid.`);
		}
		return await super.manyProperties(payload);
	}

	public async oneProperties(payload: object): Promise<object> {
		return await this.manyProperties(payload);
	}

	public async createProperties(payload: object): Promise<object> {
		if (!utilsCheckStrFilled(payload['path'])) {
			throw new MethodNotAllowedException(`Property "path" is not valid.`);
		}
		if (!utilsCheckStrFileName(payload['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (utilsCheckExists(payload['chmod']) && !utilsCheckStrFileName(payload['chmod'])) {
			throw new MethodNotAllowedException(`Property "chmod" is not valid.`);
		}
		if (utilsCheckExists(payload['force']) && !utilsCheckBool(payload['force'])) {
			throw new MethodNotAllowedException(`Property "force" is not valid.`);
		}
		return await super.createProperties(payload);
	}

	public async updateProperties(payload: object): Promise<object> {
		if (!utilsCheckStrFilled(payload['path'])) {
			throw new MethodNotAllowedException(`Property "path" is not valid.`);
		}
		if (utilsCheckExists(payload['name']) && !utilsCheckStrFileName(payload['name'])) {
			throw new MethodNotAllowedException(`Property "name" is not valid.`);
		}
		if (utilsCheckExists(payload['chmod']) && !utilsCheckStrFileName(payload['chmod'])) {
			throw new MethodNotAllowedException(`Property "chmod" is not valid.`);
		}
		return await super.updateProperties(payload);
	}

	public async dropProperties(payload): Promise<object> {
		return await this.manyProperties(payload);
	}

	public async dropManyProperties(payload: object): Promise<object> {
		if (!utilsCheckArrFilled(payload['paths'])) {
			throw new MethodNotAllowedException(`Property "paths" is not valid.`);
		}
		return payload;
	}

	public async manyProcess(processedPayload: object, payload: object): Promise<Array<Array<any> | number>> {
		const data = fs.readdir(processedPayload['path']);
		const dataProcessed = data.filter((name) => name !== '.' && name !== '..');
		let i = 0,
			output = [];

		while (i < dataProcessed.length) {
			output.push(utilsCheckFunc(processedPayload['forEach'])
				? processedPayload['forEach'](dataProcessed[i])
				: await this.oneProcess({ path: `${processedPayload['path']}/${dataProcessed[i]}` }, payload));
			i++;
		}
		return [ output, output.length ];
	}

	public async oneProcess(processedPayload: object, payload: object): Promise<any> {
		const path = this.path(processedPayload['path']);
		const stats = await fs.stat(path);

		return {
			path,
			size: stats.size,
			isDirectory: stats.isDirectory(),
		};
	}

	public async updateProcess(id: string, processedPayload: object, payload: object): Promise<object> {
		const destinationPath = this.path(processedPayload['path']);

		if (!await this.exists(destinationPath)) {
			throw new MethodNotAllowedException(`Resource "${destinationPath}" is not exists.`);
		}
		if (processedPayload['chmod']) {
			await fs.chmod(destinationPath, processedPayload['chmod']);
		}
		if (processedPayload['name']) {
			await fs.rename(destinationPath, this.path(processedPayload['path'], processedPayload['name']));
		}
		return processedPayload;
	}

	public async dropProcess(processedPayload: object | string, payload: object): Promise<any> {
		return await fs.rm(this.path(processedPayload['path']), { recursive: true });
	}

	public async dropManyProcess(processedPayload: Array<string>, payload: object): Promise<any> {
		let i = 0;

		while (i < processedPayload['paths'].length) {
			await this.dropProcess({ path: processedPayload['paths'][i] }, payload);
			i++;
		}
		return true;
	}
}
