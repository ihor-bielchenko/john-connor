import arr from './arr.js';
import obj from './obj.js';

const json = (value) => arr(value) || obj(value);

export default json;
