import { Injectable } from '@nestjs/common';
import { RedisService } from '@nest-datum/redis';

@Injectable()
export class AppService extends RedisService {
}
