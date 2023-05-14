
const path = (value) => {
	const valueSplit = value.split('/');
	let i = 0,
		output = [];

	while (i < valueSplit.length) {
		if (valueSplit[i]) {
			output.push(valueSplit[i]);
		}
		i++;
	}
	return '/'+ output.join('/');
};

export default path;
