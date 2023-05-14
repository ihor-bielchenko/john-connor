import { str as utilsCheckStr } from '@nest-datum-utils/check';

const name = (value, pattern = /[^a-zA-Zа-яА-Я0-9'-]+/g) => {
	if (!utilsCheckStr(value)) {
		value = '';
	}
	else {
		if (value[0] === ' '
			|| value[0] === '-'
			|| value[0] === "'"
			|| value[0] === "\n"
			|| value[0] === "\t") {
			value = '';
		}
		else {
			const hyphenIndex = value.indexOf('-');
			const apostropheIndex = value.indexOf("'");
			const spaceIndex = value.indexOf(' ');
			const doubleHyphenIndex = value.indexOf('--');
			const doubleApostropheIndex = value.indexOf("''");
			const doubleSpaceIndex = value.indexOf('  ');

			if (doubleHyphenIndex >= 0) {
				value = value.slice(0, doubleHyphenIndex + 1);
			}
			else if (doubleApostropheIndex >= 0) {
				value = value.slice(0, doubleApostropheIndex + 1);
			}
			else if (doubleSpaceIndex >= 0) {
				value = value.slice(0, doubleSpaceIndex + 1);
			}
			else if (hyphenIndex >= 0
				&& (value[hyphenIndex + 1] === ' '
					|| value[hyphenIndex + 1] === '-'
					|| value[hyphenIndex + 1] === "'"
					|| value[hyphenIndex + 1] === "\n"
					|| value[hyphenIndex + 1] === "\t"
					|| !Number.isNaN(Number(value[hyphenIndex + 1])))) {
				value = value.slice(0, hyphenIndex + 1);
			}
			else if (apostropheIndex >= 0
				&& (value[apostropheIndex + 1] === ' '
					|| value[apostropheIndex + 1] === '-'
					|| value[apostropheIndex + 1] === "'"
					|| value[apostropheIndex + 1] === "\n"
					|| value[apostropheIndex + 1] === "\t"
					|| !Number.isNaN(Number(value[apostropheIndex + 1])))) {
				value = value.slice(0, apostropheIndex + 1);
			}
			else if (spaceIndex >= 0
				&& (value[spaceIndex + 1] === ' '
					|| value[spaceIndex + 1] === '-'
					|| value[spaceIndex + 1] === "'"
					|| value[spaceIndex + 1] === "\n"
					|| value[spaceIndex + 1] === "\t"
					|| !Number.isNaN(Number(value[spaceIndex + 1])))) {
				value = value.slice(0, spaceIndex + 1);
			}
			else {
				value = value.replace(pattern, '');
			}
		}
	}
	return value;
};

export default name;
