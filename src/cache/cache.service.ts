import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheDBService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: string): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }
}
