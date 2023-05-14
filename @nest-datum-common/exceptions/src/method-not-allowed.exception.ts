import { MethodNotAllowedException as HttpMethodNotAllowedException } from '@nestjs/common';
import { Exception } from './exception';

export class MethodNotAllowedException extends Exception {
	public readonly cmd: string = 'notAllowed.create';
	public readonly errorCode: number = 405;
	public readonly httpExceptionConstructor = HttpMethodNotAllowedException;
}