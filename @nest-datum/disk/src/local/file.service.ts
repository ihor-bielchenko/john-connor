import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { Injectable } from '@nestjs/common';
import { MethodNotAllowedException } from '@nest-datum-common/exceptions';
import { LocalService } from './local.service';

@Injectable()
export class FileService extends LocalService {
	public async createProcess(processedPayload: object, payload: object): Promise<Array<any>> {
		let i = 0,
			output = [];

		while (i < processedPayload['files'].length) {
			const buffer = Buffer.from(processedPayload['files'][i]['buffer']);
			let mimetypeSplit = payload['files'][i].mimetype.split('/'),
				fileName = processedPayload['forceName'] ?? Buffer.from(processedPayload['files'][i]['originalname'], 'latin1').toString('utf-8'),
				fileNameSplit = fileName.split('.'),
				dbPath = `${processedPayload['path']}/${fileName}`,
				destinationPath = this.path(dbPath),
				extension = ((mimetypeSplit[mimetypeSplit.length - 1] === 'octet-stream')
					? fileNameSplit[fileNameSplit.length - 1]
					: mimetypeSplit[mimetypeSplit.length - 1]) || 'octet-stream';

			if (await this.exists(destinationPath)) {
				if (!processedPayload['force']) {
					throw new MethodNotAllowedException(`Folder "${destinationPath}" already exists.`);
				}
				fileNameSplit = fileName.split('.');
				dbPath = `${processedPayload['path']}/${fileName}`;
				destinationPath = this.path(dbPath);
				extension = ((mimetypeSplit[mimetypeSplit.length - 1] === 'octet-stream')
					? fileNameSplit[fileNameSplit.length - 1]
					: mimetypeSplit[mimetypeSplit.length - 1]) || 'octet-stream';
			}
			createWriteStream(destinationPath).write(buffer);
			output.push({ 
				name: fileName,
				path: dbPath.replace(new RegExp('//', 'g'), '/'),
				type: extension,
				size: payload['files'][i].size, 
			});

			if (processedPayload['chmod']) {
				await fs.chmod(destinationPath, processedPayload['chmod']);
			}
			i++;
		}
		return output;
	}
}
