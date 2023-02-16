import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import User from './entity/user.entity';
import * as argon2 from 'argon2';
import { Request, Response } from 'express';
import { CacheDBService } from '../cache/cache.service';
import { readdirSync } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
    private cacheDBService: CacheDBService,
  ) {}

  async createUser(email: string, username: string, password: string) {
    const hashedPw = await argon2.hash(password);
    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPw,
    });

    await this.userRepository.insert(newUser);

    return newUser;
  }

  async login(emailOrUsername: string, password: string, response: Response) {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return {
        errors: [
          { field: 'emailOrUsername', message: '해당하는 유저가 없습니다.' },
        ],
      };
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      return {
        errors: [
          { field: 'password', message: '비밀번호를 올바르게 입력해주세요.' },
        ],
      };
    }

    const accessToken = this.authService.createAccessToken(user.id);
    const refreshToken = this.authService.createRefreshToken(user.id);

    this.cacheDBService.set(String(user.id), refreshToken);
    this.setRefreshTokenHeader(response, refreshToken);

    return { user, accessToken };
  }

  async getUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return undefined;
    }

    return user;
  }

  async refreshAccessToken(req: Request) {
    const refreshToken = req.cookies.refreshtoken;
    console.log(refreshToken);
    if (!refreshToken) return null;

    const { userId } = this.authService.verifyAccessToken(refreshToken);
    if (!userId) return null;

    const storedRefreshToken = await this.cacheDBService.get(String(userId));
    if (!storedRefreshToken) return null;
    if (!(storedRefreshToken === refreshToken)) return null;

    const user = await this.getUser(userId);
    if (!user) return null;

    const newAccessToken = this.authService.createAccessToken(user.id);
    const newRefreshToken = this.authService.createRefreshToken(user.id);
    await this.cacheDBService.set(String(user.id), newRefreshToken);

    this.setRefreshTokenHeader(req.res, newRefreshToken);

    return {
      accessToken: newAccessToken,
    };
  }

  private setRefreshTokenHeader(response: Response, refreshToken: string) {
    console.log('refresh');
    response.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
