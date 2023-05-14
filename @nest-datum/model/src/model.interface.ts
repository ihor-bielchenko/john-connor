
export interface ModelInterface {
	prefix(name?: string): string;

	before(payload: object): Promise<any>;

	after(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	many(payload: object): Promise<Array<any>>;

	manyProperties(payload: object): Promise<object>;

	manyBefore(payload: object): Promise<any>;

	manyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	manyProcess(processedPayload: object, payload: object): Promise<Array<Array<any> | number>>;

	manyOutput(payload: object, data: any): Promise<Array<any>>;

	one(payload: object): Promise<any>;

	oneProperties(payload: object): Promise<object>;

	oneBefore(payload: object): Promise<any>;

	oneAfter(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	oneProcess(processedPayload: object, payload: object): Promise<any>;

	oneOutput(payload: object, data: any): Promise<any>;

	create(payload: object): Promise<object>;

	createProperties(payload: object): Promise<object>;

	createBefore(payload: object): Promise<any>;

	createAfter(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	createProcess(processedPayload: object, payload: object): Promise<any>;

	createOutput(payload: object, data: any): Promise<any>;

	update(payload: object): Promise<object>;

	updateProperties(payload: object): Promise<object>;

	updateBefore(payload: object): Promise<any>;

	updateAfter(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	updateProcess(id: string, processedPayload: object, payload: object): Promise<any>;

	updateOutput(payload: object, data: any): Promise<any>;

	drop(payload: object): Promise<boolean>;

	dropProperties(payload): Promise<object>;

	dropBefore(payload: object): Promise<any>;

	dropAfter(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	dropProcess(processedPayload: object | string, payload: object): Promise<any>;

	dropOutput(payload: object, data: any): Promise<boolean>;

	dropMany(payload: object): Promise<boolean>;

	dropManyProperties(payload: object): Promise<any>;

	dropManyBefore(payload: object): Promise<any>;

	dropManyAfter(initialPayload: object, processedPayload: object, data: any): Promise<any>;

	dropManyProcess(processedPayload: Array<string>, payload: object): Promise<any>;

	dropManyOutput(payload: object, data: any): Promise<boolean>;
}
