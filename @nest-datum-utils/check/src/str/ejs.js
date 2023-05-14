import str from './index.js';

const ejs = (value) => {
	if (!str(value)) {
		return false;
	}
	const valueSplit = value.split('.');

	return valueSplit[valueSplit.length - 1] === 'ejs'
		|| value.indexOf('data:application/octet-stream;base64') === 0
		|| value.indexOf('data:application/ejs;base64') === 0;
};

export default ejs;
