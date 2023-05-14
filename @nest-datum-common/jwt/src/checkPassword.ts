const bcrypt = require('bcrypt');

const checkPassword = async (realPassword = '', bcryptHash = '') => {
	return await bcrypt.compare(realPassword, bcryptHash);
}

export default checkPassword;
