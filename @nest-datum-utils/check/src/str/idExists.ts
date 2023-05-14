import strId from './id';

const idExists = (value) => strId(value) && value !== '0';

export default idExists;
