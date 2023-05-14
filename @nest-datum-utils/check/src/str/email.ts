import str from './index';

const email = (value) => str(value) && (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test((value || '').toLowerCase()));

export default email;

