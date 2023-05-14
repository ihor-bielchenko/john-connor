import str from './index';

const obj = (value) => {
	return str(value)
		&& value.indexOf('{"') === 0
		&& value[value.length - 1] === '}';
};

export default obj;
