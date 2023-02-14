import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './resolver/users.resolver';
import { UsersService } from './uesrs.service';
import { AuthModule } from '../auth/auth.module';
import User from './entity/user.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
