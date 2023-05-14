import fileList from './fileList.js';

const fileSize = (value, fieldName, maxSize = '5000000') => {
	const file = fileList(value)
		? value[0]
		: value;
	const sizeStr = String(file['size']);
	const maxSizeStr = String(maxSize);

	if (sizeStr.length >= maxSizeStr.length
		&& Number(sizeStr[0]) > Number(maxSizeStr[0])) {
		return false;
	}
};

export default fileSize;
