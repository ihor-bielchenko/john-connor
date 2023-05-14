import { ManyTcpModule } from './src/many-tcp.module';
import { ManyHttpModule } from './src/many-http.module';
import { ManyHttpTcpModule } from './src/many-http-tcp.module';
import { ManyService } from './src/many.service';
import { Many } from './src/many.entity';
import { ManyTcpController } from './src/many-tcp.controller';
import { ManyHttpController } from './src/many-http.controller';
import { ManyHttpTcpController } from './src/many-http-tcp.controller';

export {
	ManyTcpModule,
	ManyHttpModule,
	ManyHttpTcpModule,
	ManyTcpController,
	ManyHttpController,
	ManyHttpTcpController,
	ManyService,
	Many,
};