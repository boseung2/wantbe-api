import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  createAccessToken(userId: number) {
    const userData = { userId };
    const accessToken = this.jwtService.sign(userData);

    return accessToken;
  }

  verifyAccessToken = (accessToken?: string) => {
    if (!accessToken) return null;

    try {
      const verified = this.jwtService.verify(accessToken);

      return verified;
    } catch (err) {
      throw new AuthenticationError('access token expired');
    }
  };
}
