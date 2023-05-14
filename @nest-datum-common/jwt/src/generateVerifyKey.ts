const bcrypt = require('bcrypt');

const generateVerifyKey = async (email) => {
	return Buffer
		.from(JSON.stringify({
			email,
			password: await bcrypt.hash(Math.random().toString(36).slice(-8) + email, 11),
		}))
		.toString('base64');
};

export default generateVerifyKey;
