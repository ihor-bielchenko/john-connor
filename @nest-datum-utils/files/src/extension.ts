const { exec } = require('child_process');

const extension = async (destinationPath: string): Promise<string> => {
	return String(await (new Promise((resolve, reject) => {
		exec(`node ${process.env.PWD}/@nest-file-utiles/extension.js ${destinationPath}`, async (error, stdout, stderr) => {
			if (error) {
				return reject(new Error(error.toString()));
			}
			if (stderr) {
				return reject(new Error(stderr.toString()));
			}
			if (stdout.indexOf('Error:') === 0) {
				return reject(new Error(stdout));
			}
			if (!stdout
				|| !(stdout || '').includes(`ext: '`)) {
				return reject(new Error('Extension is undefined'));
			}
			try {
				const extSplit = stdout.split(`ext: '`);
				const output = (extSplit[1].split(`'`))[0];
							
				return resolve(output);
			}
			catch (err) {
				console.log(`Extension error`, stdout);

				return reject(err);
			}
		});
	})));
};

export default extension;
