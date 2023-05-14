
const ip = (value = '') => {
	if (value.includes('..')) {
		value = value.replace('..', '.');
	}
	if (value.includes('.')) {
		const blocks = value.split('.');

		value = ([ ...blocks ])
			.splice(0, 4)
			.map((item) => item === ''
				? item
				: (Number.isNaN(Number(item))
					? '0'
					: (Math.abs(Number(item)) > 255
						? '255'
						: Math.abs(Number(item)))))
			.join('.');
	}
	else if (Number.isNaN(Number(value))) {
		value = '0';
	}
	else if (value.includes('00')) {
		value = value.replace('00', '0');
	}
	else if (Math.abs(Number(value)) > 255) {
		value = '255';
	}
	return value;
};

export default ip;
