import obj from './index.js';

const filled = (value) => obj(value) && Object.keys(value).length > 0;

export default filled;
