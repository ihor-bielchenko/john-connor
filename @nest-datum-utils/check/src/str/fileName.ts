import str from './index';

const fileName = (value) => str(value)
	&& (/^[a-zA-Zа-я 0-9-',.!?"()@$:;+=&%\\]+$/.test(value)
	&& (!!(value).replace(/\s/g, '').length)
	&& value[0] !== '.'
	&& value.length < 80
	&& value.length >= 1);

export default fileName;
