import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export default class RedisService {
    async clearCache(pattern: string, contains: string[] = []): Promise<any> {
        const redis = new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);

        const stream = redis.scanStream({ match: pattern });

        // const keysWillDeleted: string[] = [];
        stream.on('data', (resultKeys) => {
            const pipeline = redis.pipeline();
            // let index = 0;
            for (const item of resultKeys) {
                if (contains.length === 0) {
                    pipeline.del(item);
                } else {
                    for (const containItem of contains) {
                        if (containItem && item.includes(containItem)) {
                            pipeline.del(item);
                        }
                    }
                }
                // index++;
            }
            pipeline.exec();
        });
        stream.on('end', () => {
            console.info('cache was cleared');
        });
        stream.on('error', (e) => {
            console.error('redis error', e);
        });
    }
}
