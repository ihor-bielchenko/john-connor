import arr from './arr';
import obj from './obj';

const json = (value) => {
	return arr(value) || obj(value);
};

export default json;
