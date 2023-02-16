import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './resolver/users.resolver';
import { UsersService } from './uesrs.service';
import { AuthModule } from '../auth/auth.module';
import { CacheDBModule } from '../cache/cache.module';
import User from './entity/user.entity';

@Module({
  imports: [AuthModule, CacheDBModule, TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
