import str from './index.js';

const host = (value) => {
	if (!str(value)) {
		return false;
	}
	const splitByPort = String(value).split(':');

	if (!(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(splitByPort[0]))
		&& !(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(splitByPort[0]))) {
		return false;
	}
	if (splitByPort[1]) {
		const port = Number(splitByPort[1]);

		if (typeof port !== 'number' || !(port >= 1)) {
			return false
		}
	}
	return true;
};

export default host;
