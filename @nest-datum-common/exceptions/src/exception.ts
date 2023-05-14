import { HttpException } from '@nestjs/common';

export class Exception extends Error {
	public readonly cmd: string = 'err.create';
	public readonly errorCode: number = 500;
	public readonly httpExceptionConstructor;

	public getHttp() {
		return this.httpExceptionConstructor ?? HttpException;
	}

	public getCmd(): string {
		return this.cmd;
	}

	public getMessage(): string {
		return this.message;
	}

	public data(): any {
		return {
			projectId: process.env.PROJECT_ID,
			appId: process.env.APP_ID,
			appName: process.env.APP_NAME,
			appHost: process.env.APP_HOST,
			appPort: process.env.APP_PORT,
			content: this.getMessage(),
			stack: String(this.stack),
		};
	}
}
