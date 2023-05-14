import strId from './id.js';

const idExists = (value) => strId(value) && value !== '0';

export default idExists;
