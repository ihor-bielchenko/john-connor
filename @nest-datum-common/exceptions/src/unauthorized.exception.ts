import { UnauthorizedException as HttpUnauthorizedException } from '@nestjs/common';
import { Exception } from './exception';

export class UnauthorizedException extends Exception {
	public readonly cmd: string = 'notification.create';
	public readonly errorCode: number = 401;
	public readonly httpExceptionConstructor = HttpUnauthorizedException;
}