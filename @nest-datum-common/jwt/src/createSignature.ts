const cryptoJs = require('crypto-js');

const createSignature = (publicString, secretKey) => {
	return cryptoJs.HmacSHA256(publicString, secretKey);
};

export default createSignature;
