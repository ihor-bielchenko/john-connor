import str from './index';

const image = (value) => {
	if (!str(value)) {
		return false;
	}
	const valueSplit = value.split('.');

	return valueSplit[valueSplit.length - 1] === 'png'
		|| valueSplit[valueSplit.length - 1] === 'jpeg'
		|| valueSplit[valueSplit.length - 1] === 'jpg'
		|| valueSplit[valueSplit.length - 1] === 'svg'
		|| valueSplit[valueSplit.length - 1] === 'gif'
		|| value.indexOf('data:image/png;base64') === 0
		|| value.indexOf('data:image/jpeg;base64') === 0
		|| value.indexOf('data:image/jpg;base64') === 0
		|| value.indexOf('data:image/svg;base64') === 0
		|| value.indexOf('data:image/png;base64') === 0;
};

export default image;
