import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context).getContext();

    const { authorization } = gqlContext.req.headers;

    // Authorization header가 존재하지 않으면 가드 통과 X
    if (!authorization) return false;

    const accessToken = authorization.split(' ')[1];
    const { userId } = this.authService.verifyAccessToken(accessToken);

    // req 객체에 userId 넣는다.
    gqlContext.req.userId = userId;

    return !!userId;
  }
}
