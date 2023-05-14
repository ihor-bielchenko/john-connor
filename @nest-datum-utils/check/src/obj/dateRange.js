import obj from './index.js';

const dateRange = (value) => {
	if (!obj(value)) {
		return false;
	}
	if (value['start'] && value['start'].length === 6
		&& value['end'] && value['end'].length === 6) {
		return true;
	}
	return false;
};

export default dateRange;
