import str from './index.js';

const bool = (value) => str(value) && (value === '1' || value === '0');

export default bool;
