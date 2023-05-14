import obj from './index.js';
import strId from '../str/id.js';

const fileModel = (value) => {
	return obj(value) && strId(value['id']);
};

export default fileModel;
