import fileName from './fileName.js';
import str from './index.js';

const path = (value) => {
	if (!str(value)) {
		return false;
	}
	const valueSplit = value.split('/');

	if (valueSplit.length <= 0) {
		return false;
	}
	let i;

	while (i < valueSplit.length) {
		if (valueSplit[i]) {
			if (!fileName(valueSplit[i])) {
				return false;
			}
		}
		i++;
	}
	return true;
};

export default path;
