import { 
	CustomTransportStrategy, 
	ServerTCP, 
	MessageHandler,
} from '@nestjs/microservices';

export class TcpStrategy extends ServerTCP implements CustomTransportStrategy {
	public override getHandlerByPattern(pattern: string) {
		const output = super.getHandlerByPattern(pattern);

		return output;
	}
}
