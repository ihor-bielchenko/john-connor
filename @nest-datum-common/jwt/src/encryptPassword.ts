const bcrypt = require('bcrypt');

const encryptPassword = async (realPassword = '') => {
	return await bcrypt.hash(realPassword, 10);
};

export default encryptPassword;
