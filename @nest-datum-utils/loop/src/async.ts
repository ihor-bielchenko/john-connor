
const async = async (arr: Array<any>, callback: Function): Promise<Array<any>> => {
	let i = 0,
		output = [];

	while (i < arr.length) {
		output.push(await callback(arr[i], i));
		i++;
	}
	return output;
};

export default async;
