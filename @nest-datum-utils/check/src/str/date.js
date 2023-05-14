import str from './index.js';
import numeric from '../numeric.js';

const date = (value) => {
	if (!value) {
		return false;
	}
	let processedValue = value;

	if (str(value) || numeric(value)) {
		processedValue = new Date(value);
	}
	return (processedValue instanceof Date && !Number.isNaN(processedValue));
};

export default date;
