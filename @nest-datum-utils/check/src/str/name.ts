import utilsCheckStrDescription from './description.js';

const name = (value) => utilsCheckStrDescription(value) && value.length < 127;

export default name;
