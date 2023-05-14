import { InternalServerErrorException } from '@nestjs/common';
import { Exception } from './exception';

export class FailureException extends Exception {
	public readonly cmd: string = 'fauilure.create';
	public readonly httpExceptionConstructor = InternalServerErrorException;
}