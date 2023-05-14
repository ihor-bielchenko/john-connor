import str from './index';

const id = (value) => str(value) && /^[a-zA-Z0-9-_]+$/.test(value) && value.length < 64;

export default id;
