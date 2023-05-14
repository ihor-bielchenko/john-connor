import utilsJWTGenerateAccessToken from './generateAccessToken';
import utilsJWTGenerateRefreshToken from './generateRefreshToken';

const generateTokens = (userData) => {
	const iat = Date.now();

	delete userData.password;
	delete userData.emailVerifyKey;
	delete userData.emailVerifiedAt;

	const data = {
		accessToken: utilsJWTGenerateAccessToken(userData, iat, process.env.JWT_ACCESS_TIMEOUT),
		refreshToken: utilsJWTGenerateRefreshToken(userData, iat, process.env.JWT_REFRESH_TIMEOUT),
		userData,
	};

	return data;
};

export default generateTokens;
