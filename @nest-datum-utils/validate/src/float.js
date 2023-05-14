
const validFirstSign = ['', '-', '.'];
const regExpNumeric = "^[+-]?\\d*\\.\\d+$|^[+-]?\\d+(\\.\\d*)?$";
const float = (value = '') => {
	if (!value.match(regExpNumeric) && !validFirstSign.indexOf(value) >= 0) {
		return value.substring(0, value.length - 1);
	}
	if (value[0] === '0' && value[1] !== '.')	{
		return '0';
	}
	return value;
};

export default float;
