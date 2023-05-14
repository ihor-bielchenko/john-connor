const https = require('https');
const http = require('http');
const fs = require('fs');

import {
	strPath as utilsCheckStrPath,
	strUrl as utilsCheckStrUrl,
} from '@nest-datum-utils/check';

const download = async (sourcePath: string, destinationPath: string, forceSave: boolean = false) => {
	if (!utilsCheckStrUrl(sourcePath)) {
		throw new Error (`Source path "${sourcePath}" is not valid.`);
	}
	if (!utilsCheckStrPath(destinationPath)) {
		throw new Error (`Destination path "${destinationPath}" is not valid.`);
	}
	if (!forceSave) {
		await (new Promise((resolve, reject) => {
			fs.exists(destinationPath, (isExist) => isExist
				? reject(new Error(`File "${destinationPath}" already exists.`))
				: resolve(true));
		}));
	}
	const resource = fs.createWriteStream(destinationPath);
	const request = (sourcePath.indexOf('https://') === 0)
		? https
		: http;

	await (new Promise((resolve, reject) => {
		const fetch = request.get(sourcePath, (response) => {
			if (response.statusCode !== 200
				&& response.statusCode !== 201) {
				return reject(new Error(`Download file "${sourcePath}" error.`));
			}
			response.pipe(resource);
		});

		fetch.on('error', (reqErr) => {
			fs.unlink(destinationPath, (fsErr) => {
				if (fsErr) {
					return reject(new Error(fsErr.message));
				}
				return reject(new Error(reqErr.message));
			});
		});

		resource.on('finish', () => {
			resource.close();

			return resolve(true);
		});
	}));
	return destinationPath;
};

export default download;
