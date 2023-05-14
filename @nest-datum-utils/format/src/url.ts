import { generateAccessToken } from '@nest-datum-common/jwt';
import {
	strUrl as utilsCheckStrUrl,
	strPath as utilsCheckStrPath,
} from '@nest-datum-utils/check';
import path from './path';

const _withProps = (value: string) => {
	const valueSplit = value.split('?');

	if (valueSplit.length >= 2) {
		const domenName = valueSplit.shift();

		return `${domenName}?accessToken=${generateAccessToken()}&${valueSplit.join('?')}`;
	}
	return `${value}?accessToken=${generateAccessToken()}`;
};

const url = (value: string, intervalUrl: string) => {
	if (utilsCheckStrUrl(value)) {
		if (value.indexOf(intervalUrl) === 0) {
			return _withProps(value);
		}
		return value;
	}
	else if (utilsCheckStrPath(value)) {
		return intervalUrl + _withProps(path(value));
	}
	throw new Error('Can not format value to url string.');
};

export default url;
