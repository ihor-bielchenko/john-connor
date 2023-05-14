import obj from './index';
import strId from '../str/id';

const fileModel = (value) => {
	return obj(value) && strId(value['id']);
};

export default fileModel;
