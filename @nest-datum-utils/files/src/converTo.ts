const { exec } = require('child_process');

const convertTo = async (destinationPath: string, format: string): Promise<any> => {
	return await (new Promise((resolve, reject) => {
		exec(`node ${process.env.PWD}/@nest-file-utiles/convertTo.js ${destinationPath} ${format}`, async (error, stdout, stderr) => {
			if (error) {
				return reject(new Error(error.toString()));
			}
			if (stderr) {
				return reject(new Error(stderr.toString()));
			}
			if (stdout.indexOf('Error:') === 0) {
				return reject(new Error(stdout));
			}
			resolve(true);
		});
	}));
};

export default convertTo;
