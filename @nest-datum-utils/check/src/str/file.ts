import str from './index';

const file = (value) => str(value) && value.indexOf('data:') === 0 && value.includes(';base64');

export default file;
