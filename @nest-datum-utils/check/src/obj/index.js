
const obj = (value) => {
	return value
		&& typeof value === 'object'
		&& !Array.isArray(value);
};

export default obj;
