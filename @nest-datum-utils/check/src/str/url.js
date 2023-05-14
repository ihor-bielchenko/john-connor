import str from './index.js';

const url = (value = '') => str(value) 
	&& ((value || '').indexOf('http://') === 0 
		|| (value || '').indexOf('https://') === 0);

export default url;
