import name from './name.js';

const user = (value) => name(value, /[^a-zA-Zа-яА-Я '-]+/g);

export default user;
