require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
// import { 
// 	onExit,
// 	onWarning,
// 	onUncaughtException, 
// } from '@nest-datum-common/process';
import { TcpStrategy } from '@nest-datum-common/strategies';
import { 
	TransportModule,
	TransportService, 
} from '@nest-datum/transport';
import { AppModule } from './app.module';

// process.on('exit', onExit);
// process.on('warning', onWarning);
// process.on('uncaughtException', onUncaughtException);

async function bootstrap() {
	const appTcp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		strategy: new TcpStrategy({
			host: process.env.APP_HOST,
			port: Number(process.env.APP_PORT),
		}),
	});
	const appHttp = await NestFactory.create(AppModule);
	const transport = await NestFactory.create(TransportModule);
	const transportService = transport.get(TransportService);

	try {
		appHttp.enableCors();

		await transportService.create();
		await appHttp.listen(Number(process.env.APP_HTTP_PORT), async () => {
			console.log('HTTP service listening on port:', process.env.APP_HTTP_PORT);
			console.log('Replica listening on port:', process.env.APP_PORT);

			await appTcp.listen();
			await transport.close();

			console.log(`Successfuly started on "${process.env.APP_HOST}:${process.env.APP_PORT}".`);
		});
	}
	catch (err) {
		await appTcp.close();
		
		console.error(err.message);
	}
};

bootstrap();
