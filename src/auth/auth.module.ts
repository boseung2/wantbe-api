import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

const DEFAULT_JWT_SECRET_KEY = 'secret-key';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY || DEFAULT_JWT_SECRET_KEY,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [
    AuthService,
    // global guard 설정 시 주석 제거
    // { provide: APP_GUARD, useClass: GqlAuthGuard },
  ],
  exports: [AuthService],
})
export class AuthModule {}
