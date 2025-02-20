import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any): any { // ✅ Explicitly define types
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
