import utilsJWTCreateHeader from './createHeader';
import utilsJWTCreatePayload from './createPayload';
import utilsJWTCreateSignature from './createSignature';

const generateRefreshToken = (userData, iat, exp = process.env.JWT_REFRESH_TIMEOUT) => {
	const publicString = `${utilsJWTCreateHeader()}.${utilsJWTCreatePayload({
		exp,
		id: userData.id,
		iat,
	})}`;

	return `${publicString}.${utilsJWTCreateSignature(publicString.trim(), process.env.JWT_SECRET_REFRESH_KEY || process['JWT_SECRET_REFRESH_KEY'])}`;
};

export default generateRefreshToken;
