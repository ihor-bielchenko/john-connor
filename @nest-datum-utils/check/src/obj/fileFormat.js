import fileList from './fileList.js';

const fileFormat = (value, fieldName, allowList = [ 'application/pdf', 'application/doc', 'application/docx' ]) => {
	const file = fileList(value)
		? value[0]
		: value;

	return allowList.filter((item) => item !== file['type']).length === allowList.length - 1;
};

export default fileFormat;
