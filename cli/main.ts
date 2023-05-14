require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { NeuronService } from 'src/api/neuron/neuron.service';
import { AppModule } from './app.module';

async function bootstrap() {
	const appModule = await NestFactory.create(AppModule);
	const neuronService = appModule.get(NeuronService);

	try {
		console.log('???', await neuronService.chain());
		// await neuronService.chain();
	}
	catch (err) {
		console.error(err);
	}
};

bootstrap();
