import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { 
	ClientProxyFactory,
	Transport, 
} from '@nestjs/microservices';
import { RedisService } from '@nest-datum/redis';
import { 
	Exception,
	FailureException,
	WarningException, 
	NotificationException,
	NotFoundException,
	UnauthorizedException,
	MethodNotAllowedException,
} from '@nest-datum-common/exceptions';
import {
	exists as utilsCheckExists,
	obj as utilsCheckObj,
	strId as utilsCheckStrId,
	strHost as utilsCheckStrHost,
	strQueue as utilsCheckStrQueue,
	strFilled as utilsCheckStrFilled,
	numericInt as utilsCheckNumericInt,
} from '@nest-datum-utils/check';

const _savedInstance = {};

@Injectable()
export class TransportService extends RedisService {
	private startCacheEntities: Array<any> = [];
	
	constructor(
		@InjectRedis('Transport') public repository: Redis,
	) {
		super();
	}

	setStartCacheEntities(entites: Array<any> = []): Array<any> {
		return (this.startCacheEntities = entites);
	};

	connection(replicaData?: object): any {
		const id = replicaData['id'];
		const host = replicaData['host'];
		const port = replicaData['port'];
		let connectionInstance = _savedInstance[id];

		if (!connectionInstance
			&& utilsCheckStrHost(host)
			&& utilsCheckNumericInt(port)) {
			connectionInstance = ClientProxyFactory.create({
				transport: Transport.TCP,
				options: {
					host: host || process.env.APP_HOST,
					port: Number(port || process.env.APP_PORT),
				},
			});
			_savedInstance[id] = connectionInstance;

			connectionInstance.connect();
		}
		return connectionInstance;
	}

	async isConnected(connectionInstance, id: string): Promise<boolean> {
		try {
			let interval,
				index = 0;

			if (!connectionInstance['isConnected']) {
				await (new Promise((resolve, reject) => {
					interval = setInterval(() => {
						if (connectionInstance
							&& connectionInstance['isConnected']) {
							clearInterval(interval);
							resolve(true);
							return;
						}
						else if (index >= Number(process.env.SETTING_TRANSPORT_CONNECT_ATTEMPTS || 3)) {
							clearInterval(interval);
							reject(new Error(`Service "${id}" is unavailable.`));
							return;
						}
						index += 1;
					}, Number(process.env.SETTING_TRANSPORT_CONNECT_ATTEMPTS_TIMEOUT || 200));
				}));
			}
			return true;
		}
		catch (err) {
			delete _savedInstance[id];
		}
		return false;
	}

	async lessLoadedConnection(appName: string): Promise<object> {
		const redisValue = await this.repository.lindex(this.prefix(appName), 0);

		if (!utilsCheckStrQueue(redisValue)) {
			throw new NotFoundException(`Replica ${appName} is undefined.`);
		}
		const redisValueSplit = redisValue.split('|');

		return {
			id: redisValueSplit[0],
			name: appName,
			host: redisValueSplit[1],
			port: redisValueSplit[2],
		};
	}

	async balance(payload?: object): Promise<string> {
		const host = payload['app_host'] ?? process.env.APP_HOST;
		const port = payload['app_port'] ?? process.env.APP_PORT;
		const name = payload['app_name'] ?? process.env.APP_NAME;
		const id = payload['app_id'] ?? process.env.APP_ID;

		try {
			await this.repository.lrem(this.prefix(name), 0, `${id}|${host}|${port}`);
		}
		catch (err) {
		}
		await this.repository.rpush(this.prefix(name), `${id}|${host}|${port}`);

		return id;
	}

	protected async oneProcess(processedPayload: object, payload: object): Promise<any> {
		return {
			id: processedPayload['key'],
			name: await this.repository.get(this.prefix(`${processedPayload['key']}|app_name`)),
			host: await this.repository.get(this.prefix(`${processedPayload['key']}|app_host`)),
			port: await this.repository.get(this.prefix(`${processedPayload['key']}|app_port`)),
		};
	}

	protected async createProperties(payload: object): Promise<object> {
		payload['app_host'] = payload['app_host'] ?? process.env.APP_HOST;
		payload['app_port'] = payload['app_port'] ?? process.env.APP_PORT;
		payload['app_name'] = payload['app_name'] ?? process.env.APP_NAME;
		payload['user_id'] = payload['user_id'] ?? process.env.USER_ID;
		payload['user_login'] = payload['user_login'] ?? process.env.USER_LOGIN;
		payload['user_admin_role'] = payload['user_admin_role'] ?? process.env.USER_ADMIN_ROLE;

		if (!utilsCheckStrHost(payload['app_host'])) {
			throw new Error('Replica "app_host" is undefiined.');
		}
		if (!utilsCheckNumericInt(payload['app_port'])) {
			throw new Error('Replica "app_port" is undefiined.');
		}
		if (!utilsCheckStrId(payload['user_id'])) {
			throw new Error('Replica "user_id" is undefiined.');
		}
		if (!utilsCheckStrFilled(payload['user_id'])) {
			throw new Error('Replica "user_id" is undefiined.');
		}
		if (!utilsCheckStrId(payload['user_admin_role'])) {
			throw new Error('Replica "user_admin_role" is undefiined.');
		}
		return payload;
	}

	protected async createProcess(processedPayload: object, payload: object): Promise<object> {
		const host = payload['app_host'] ?? process.env.APP_HOST;
		const port = payload['app_port'] ?? process.env.APP_PORT;
		const name = payload['app_name'] ?? process.env.APP_NAME;
		const id = payload['app_id'] ?? process.env.APP_ID;
		const userId = payload['user_id'] ?? process.env.USER_ID;
		const userLogin = payload['user_login'] ?? process.env.USER_LOGIN;

		await this.repository.set(this.prefix(`${name}|${id}|app_id`), id);
		await this.repository.set(this.prefix(`${id}|app_name`), name);
		await this.repository.set(this.prefix(`${id}|app_host`), host);
		await this.repository.set(this.prefix(`${id}|app_port`), port);
		await this.repository.set(this.prefix(`${id}|user_id`), userId);
		await this.repository.set(this.prefix(`${id}|user_login`), userLogin);

		await this.balance(processedPayload);
		await this.startCache();
		await this.sendLog(new NotificationException(`Started replica "${processedPayload['host']}:${processedPayload['port']}".`));

		return processedPayload;
	}

	async startCache(): Promise<Array<any>> {
		let i = 0;

		while (i < this.startCacheEntities.length) {
			await this.startCacheEntities[i].startCache(i, this.startCacheEntities);
			i++;
		}
		return this.startCacheEntities;
	}

	async send({ name, id, cmd }: { name?: string, id?: string; cmd: string }, payload: any): Promise<any> {
		const replicaData = utilsCheckStrId(id)
			? await this.one({ key: id })
			: await this.lessLoadedConnection(name);

		if (!replicaData) {
			throw new NotFoundException(`Replica "${id || name}" not found.`);
		}
		const connectionInstance = this.connection(replicaData);

		if (!connectionInstance
			|| !(await this.isConnected(connectionInstance, replicaData['id']))) {
			throw new NotFoundException(`Replica "${id || name}" not found.`);
		}
		const cmdIsPostAction = cmd.includes('.create') 
			|| cmd.includes('.send')
			|| cmd.includes('.content');

		if (cmdIsPostAction
			&& utilsCheckObj(payload)
			&& !utilsCheckStrId(payload['id'])) {
			payload['id'] = uuidv4();
			payload['createdAt'] = (new Date()).toISOString();
		}
		if (cmdIsPostAction
			|| cmd.includes('.update')
			|| cmd.includes('.drop')) {
			connectionInstance.emit(cmd, { ...payload });
		}
		else {
			let connectionInstanceResponse;

			try {
				connectionInstanceResponse = await lastValueFrom(connectionInstance
					.send({ cmd }, payload)
					.pipe(map(response => response)));
			}
			catch (err) {
				throw new FailureException(err.message);
			}
			if (!utilsCheckExists(connectionInstanceResponse)) {
				throw new NotFoundException(`Resource not found.`);
			}
			else if (utilsCheckObj(connectionInstanceResponse) 
				&& utilsCheckNumericInt(connectionInstanceResponse['errorCode'])) {
				switch (connectionInstanceResponse['errorCode']) {
					case 405:
						throw new MethodNotAllowedException(connectionInstanceResponse['message']);
					case 404:
						throw new NotFoundException(connectionInstanceResponse['message']);
					case 403:
						throw new WarningException(connectionInstanceResponse['message']);
					case 401:
						throw new UnauthorizedException(connectionInstanceResponse['message']);
					default:
						throw new FailureException(connectionInstanceResponse['message']);
				}
			}
			return connectionInstanceResponse;
		}
		if (utilsCheckObj(payload)) {
			delete payload['accessToken'];
			delete payload['refreshToken'];
		}
		return payload;
	}

	async sendLog(exception: Exception): Promise<any> {
		try {
			await this.send({ 
				name: process.env.SERVICE_LOGS,
				cmd: exception.getCmd(), 
			}, exception.data());
		}
		catch (err) {
		}
	}
}
