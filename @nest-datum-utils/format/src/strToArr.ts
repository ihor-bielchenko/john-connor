import { arr as utilsCheckArr } from '@nest-datum-utils/check';

const strToArr = (value) => {
	if (utilsCheckArr(value)) {
		return value;
	}
	try {
		return JSON.parse(value);
	}
	catch (err) {
		return [];
	}
};

export default strToArr;
