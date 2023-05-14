import {
	exists as utilsCheckExists,
	arr as utilsCheckArr,
	obj as utilsCheckObj,
	objFilled as utilsCheckObjFilled,
	str as utilsCheckStr,
} from '@nest-datum-utils/check';

const urlApiStr = (url, data = {}) => {
	const accessToken = localStorage.getItem(`${process.env.URL_UI}_accessToken`);
	let key,
		processed = {};

	if (utilsCheckObjFilled(data)) {
		for (key in data) {
			if (utilsCheckExists(data[key])) {
				processed[key] = (utilsCheckObj(data[key]) || utilsCheckArr(data[key]))
					? JSON.stringify(data[key])
					: data[key];
			}
		}
	}
	if (!processed['query']) {
		delete processed['query'];
	}
	const urlApiHttpSplit = process.env.URL_API_HTTP.split('/');
	const urlApiFilesSplit = process.env.URL_API_FILES.split('/');

	return (utilsCheckObjFilled(processed))
		? `${url}?${new URLSearchParams({
			...processed,
			...(utilsCheckStr(accessToken)
				&& (url.indexOf(`${urlApiHttpSplit[0]}/${urlApiHttpSplit[1]}`) === 0
					|| url.indexOf(`${urlApiFilesSplit[0]}/${urlApiFilesSplit[1]}`) === 0))
				? { accessToken }
				: {},
		}).toString()}`
		: `${url}${(utilsCheckStr(accessToken)
			&& (url.indexOf(`${urlApiHttpSplit[0]}/${urlApiHttpSplit[1]}`) === 0
				|| url.indexOf(`${urlApiFilesSplit[0]}/${urlApiFilesSplit[1]}`) === 0)) 
				? `?accessToken=${accessToken}` 
				: ''}`;
};

export default urlApiStr;
