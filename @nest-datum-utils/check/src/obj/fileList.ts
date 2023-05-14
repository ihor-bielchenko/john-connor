import objFilled from './filled';

const fileList = (value) => objFilled(value) && value.constructor.name === 'FileList';

export default fileList;
