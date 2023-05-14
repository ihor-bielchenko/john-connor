import str from './index';

const queue = (value = '') => {
	return str(value) && value.split('|').length === 3;
};

export default queue;
