import utilsJWTCreateHeader from './createHeader';
import utilsJWTCreatePayload from './createPayload';
import utilsJWTCreateSignature from './createSignature';

const generateAccessToken = (userData = {}, iat: number = Date.now(), exp = process.env.JWT_ACCESS_TIMEOUT) => {
	const id = userData['id'] || process.env.USER_ID;
	const email = userData['email'] || process.env.USER_EMAIL;
	const roleId = userData['roleId'] || process.env.USER_ADMIN_ROLE;
	const publicString = `${utilsJWTCreateHeader()}.${utilsJWTCreatePayload({
		exp,
		id,
		email,
		roleId,
		iat,
	})}`;

	return `${publicString}.${utilsJWTCreateSignature(publicString.trim(), process.env.JWT_SECRET_ACCESS_KEY || process['JWT_SECRET_ACCESS_KEY'])}`;
};

export default generateAccessToken;
