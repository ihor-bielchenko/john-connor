import obj from './index';

const filled = (value) => obj(value) && Object.keys(value).length > 0;

export default filled;
