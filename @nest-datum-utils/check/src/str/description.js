import str from './index.js';

const description = (value) => str(value) && (value.length > 0
	? /^[a-zA-Zа-яА-Я 0-9-',!?"()@$:;+=&.%]+$/.test(value) && value.length < 255
	: true);

export default description;
