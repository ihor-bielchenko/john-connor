import {
	arr as utilsCheckArr,
	obj as utilsCheckObj,
} from '@nest-datum-utils/check';

const objMergeRec = (target, payload) => {
	let i = 0;

	if (utilsCheckObj(target) || utilsCheckArr(target)) {
		if (((payload || {})['path'] || []).length >= 2) {
			while (i < payload['path']['length'] - 2) {
				target = target[payload['path'][i]];
				i++;
			}
			target[payload['path'][payload['path']['length'] - 2]][payload['path'][payload['path']['length'] - 1]] = payload.propValue;
		}
		else if (((payload || {}).path || []).length === 1) {
			target[payload['path'][payload['path']['length'] - 1]] = (payload || {}).propValue;
		}
	}
	return target;
};

export default objMergeRec;
