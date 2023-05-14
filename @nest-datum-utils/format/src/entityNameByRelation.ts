import {
	arr as utilsCheckArr,
	str as utilsCheckStr,
} from '@nest-datum-utils/check';

const entityNameByRelation = (relationEntityName = '') => {
	const relationEntityNameMatch = relationEntityName.match(/[A-Z][a-z]+/g);

	if (utilsCheckArr(relationEntityNameMatch)) {
		const relationEntityNameSplit = relationEntityName.split(relationEntityNameMatch.join(''));

		if (relationEntityNameSplit.length === 2
			&& !relationEntityNameSplit[1]
			&& utilsCheckStr(relationEntityNameSplit[0])) {
			return relationEntityNameSplit[0];
		}
	}
	return '';
};

export default entityNameByRelation;
