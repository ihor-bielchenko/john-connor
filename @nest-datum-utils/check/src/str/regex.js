import strFilled from './filled.js';

const regex = (value) => strFilled(value) && ((new RegExp(value)) instanceof RegExp);

export default regex;
