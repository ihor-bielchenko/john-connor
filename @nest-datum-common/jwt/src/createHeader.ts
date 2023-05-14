
const createHeader = () => {
	return Buffer
		.from(JSON.stringify({
			alg: 'HS256',
			typ: 'JWT',
		}))
		.toString('base64');
};

export default createHeader;
