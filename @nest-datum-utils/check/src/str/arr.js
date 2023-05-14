import str from './index.js';

const arr = (value) => str(value)
	&& value[0] === '['
	&& value[value.length - 1] === ']';

export default arr;
