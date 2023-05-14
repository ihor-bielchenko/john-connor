import {
	exists as utilsCheckExists,
	obj as utilsCheckObj,
	strId as utilsCheckStrId,
	strFile as utilsCheckStrFile,
} from '@nest-datum-utils/check';

const formDataNode = (data) => {
	if (utilsCheckObj(data) && utilsCheckStrId(data['id'])) {
		const fileNodes = document.getElementsByClassName(`option-value-${data.id}-fileNode`);

		if (utilsCheckExists(fileNodes[0])) {
			const content = (data.content || {}).src || '';

			if (utilsCheckStrFile(content)) {
				const formData = new FormData();

				formData.append('files', fileNodes[0]['files'][0]);
				formData.append('systemId', data.content['systemId']);

				return formData;
			}
		}
	}
	return null;
};

export default formDataNode;
