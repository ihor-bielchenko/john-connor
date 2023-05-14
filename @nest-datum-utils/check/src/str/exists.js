import str from './index.js';

const exists = (value) => {
	return str(value) && value;
};

export default exists;
