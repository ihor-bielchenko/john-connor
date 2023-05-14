import str from './index.js';

const userName = (value) => str(value) 
	&& /^[a-zA-Zа-яА-Я0-9'-]+$/.test(value)
	&& value.length <= 80;

export default userName;
