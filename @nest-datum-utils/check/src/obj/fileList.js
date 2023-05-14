import objFilled from './filled.js';

const fileList = (value) => objFilled(value) && value.constructor.name === 'FileList';

export default fileList;
