import { Exception } from './exception';

export class NotificationException extends Exception {
	public readonly cmd: string = 'notification.create';
	public readonly errorCode: number = 200;
}