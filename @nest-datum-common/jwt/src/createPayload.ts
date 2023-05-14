
const createPayload = (data) => {
	return Buffer
		.from(JSON.stringify(data))
		.toString('base64');
};

export default createPayload;
