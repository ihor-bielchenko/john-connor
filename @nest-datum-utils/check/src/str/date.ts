import str from './index';
import numeric from '../numeric';

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
