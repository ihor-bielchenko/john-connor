import { ForbiddenException as HttpForbiddenException } from '@nestjs/common';
import { Exception } from './exception';

export class ForbiddenException extends Exception {
	public readonly cmd: string = 'notification.create';
	public readonly errorCode: number = 403;
	public readonly httpExceptionConstructor = HttpForbiddenException;
}