require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const appHttp = await NestFactory.create(AppModule);

	try {
		appHttp.enableCors();

		await appHttp.listen(Number(process.env.APP_HTTP_PORT), async () => {
			console.log('HTTP service listening on port:', process.env.APP_HTTP_PORT);
			console.log('Replica listening on port:', process.env.APP_PORT);
		});
	}
	catch (err) {
		console.error(err.message);
	}
};

bootstrap();
