import str from './index.js';

const password = (value) => str(value) 
	&& value[0] !== ' '
	&& value[value.length - 1] !== ' '
	&& value.length >= 8 
	&& value.length <= 255
	&& /\d/.test(value)
	&& /\p{L}/u.test(value);

export default password;
