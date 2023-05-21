require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { NeuronService } from 'src/api/neuron/neuron.service';
import { AppModule } from './app.module';

async function bootstrap() {
	const appModule = await NestFactory.create(AppModule);
	const neuronService = appModule.get(NeuronService);

	try {
		// const { neuronId, value } = await neuronService.pass(50, '2');

		// console.log('Chain ID:', { neuronId, value });
	}
	catch (err) {
		console.error(err);
	}
};

bootstrap();
