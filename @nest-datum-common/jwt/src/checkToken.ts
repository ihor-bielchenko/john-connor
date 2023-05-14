import utilsJWTCreateHeader from './createHeader';
import utilsJWTCreatePayload from './createPayload';
import utilsJWTCreateSignature from './createSignature';

const checkToken = (token = '', key = '', payload: any = null) => {
	if (!token || token === 'undefined' || token === 'null') {
		return false;
	}
	if (!(payload && typeof payload === 'object')) {
		payload = JSON.parse(String(Buffer.from((String(token).split('.'))[1], 'base64')));
	}
	const publicString = `${utilsJWTCreateHeader()}.${utilsJWTCreatePayload(payload)}`;
	const recoveredToken = `${publicString}.${utilsJWTCreateSignature(publicString.trim(), key)}`;

	return payload;
};

export default checkToken;
