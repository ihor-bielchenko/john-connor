import strToLat from './strToLat.js';

const strToEnv = (value = '') => {
	return strToLat(value)
		.trim()
		.replace(/[\n\t]/g, '')
		.replace(/[^a-zA-Z0-9]/g, '_')
		.toUpperCase();
};

export default strToEnv;
