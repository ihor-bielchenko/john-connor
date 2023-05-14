import { NotificationException } from './notification.exception';

export class WarningException extends NotificationException {
	public readonly cmd: string = 'warning.create';
}