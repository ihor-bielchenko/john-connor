
const date = (value = '', target = null) => {
	const currentYear = (new Date()).getFullYear();
	const valueSplit = value.split('/');
	let output = '';

	if (valueSplit.length === 2) {
		valueSplit[0] = valueSplit[0].replace(new RegExp('_', 'g'), '');
		valueSplit[1] = valueSplit[1].replace(new RegExp('_', 'g'), '');

		if (valueSplit[0][0]
			&& valueSplit[0][0] !== '0'
			&& valueSplit[0][0] !== '1') {
			output = `0${valueSplit[0][0]}`;
		}
		else {
			output = `${valueSplit[0]}`;
		}
		if (Number(valueSplit[0]) > 12) {
			output = '12';
		}
		if (valueSplit[1].length === 4) {
			const inputValueYear = Number(valueSplit[1]);
			const valueYear = Math.abs(currentYear - inputValueYear);
			const currentYearForward = currentYear + valueYear;
			const currentYearBack = currentYear - valueYear;

			if (currentYearForward > currentYear + 100 || currentYearBack < currentYear - 100) {
				if (inputValueYear > currentYear) {
					valueSplit[1] = currentYear + 100;
				}
				else {
					valueSplit[1] = currentYear - 100;
				}
			}
		}
		output += valueSplit[1];
	}
	if (target) {
		setTimeout(() => {
			target.selectionStart = (output.length >= 2) ? (output.length + 1) : output.length;
			target.selectionEnd = (output.length >= 2) ? (output.length + 1) : output.length;
		}, 0);
	}
	return output || '__/____';
};

export default date;
