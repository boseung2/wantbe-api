import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const DEFAULT_JWT_SECRET_KEY = 'secret-key';

@Injectable()
export class AuthService {
  createAccessToken(userId: number) {
    const userData = { userId };
    const accessToken = jwt.sign(
      userData,
      process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
      { expiresIn: '30m' },
    );

    return accessToken;
  }
}
