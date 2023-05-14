import str from './index';

const bool = (value) => str(value) && (value === '1' || value === '0');

export default bool;
