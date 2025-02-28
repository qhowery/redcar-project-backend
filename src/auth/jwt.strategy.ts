import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtPayload } from '../../types/jwt-payload';
import { StrategyOptionsWithoutRequest } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
      passReqToCallback: false // ✅ Explicitly specify request handling
    } as StrategyOptionsWithoutRequest);
  }

  async validate(payload: JwtPayload) {
    return { 
      sub: payload.sub, 
      username: payload.username 
    };
  }
}

