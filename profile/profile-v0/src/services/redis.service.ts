import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export default class RedisService {
    async clearCache(pattern: string, contains: string[] = []): Promise<any> {
        const redis = new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);

        const resultKeys = await redis.keys(pattern);
        for (const item of resultKeys) {
            if (contains.length === 0) {
                await redis.del(item);
            } else {
                for (const containItem of contains) {
                    if (containItem && item.includes(containItem)) {
                        await redis.del(item);
                    }
                }
            }
        }
        return true;
    }
}
