import checkToken from './checkToken';
import utilsJWTCreatePayload from './createPayload';
import utilsJWTCreateSignature from './createSignature';

const getUser = (token: string = '') => {
	if (token === 'undefined' || token === 'null') {
		return false;
	}
	if (token) {
		const data = checkToken(token, process.env.JWT_SECRET_ACCESS_KEY);
	
		if (!data) {
			throw new Error(`Token is not valid.`);
		}
		return { token, ...data };
	}
	return { authFlag: false };
};

export default getUser;
