import { 
	createParamDecorator, 
	ExecutionContext, 
} from '@nestjs/common';

export const AccessToken = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
	const request = ctx.switchToHttp().getRequest();
	
	return request['headers']['access-token']
		|| request['body']['accessToken']
		|| request['query']['accessToken'];
});
