import { NotFoundException as HttpNotFoundException } from '@nestjs/common';
import { Exception } from './exception';

export class NotFoundException extends Exception {
	public readonly cmd: string = 'warning.create';
	public readonly errorCode: number = 404;
	public readonly httpExceptionConstructor = HttpNotFoundException;
}