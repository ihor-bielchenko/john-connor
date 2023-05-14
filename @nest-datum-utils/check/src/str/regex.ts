import strFilled from './filled';

const regex = (value) => strFilled(value) && ((new RegExp(value)) instanceof RegExp);

export default regex;
