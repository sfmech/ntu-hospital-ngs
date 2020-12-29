import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      jwtFromRequest: (request: express.Request) => {
        return request.cookies['jwt-auth-token'];
      },
      passReqToCallback: true,
    });
  }

  async validate(request: express.Request, payload: any): Promise<any> {
    return payload;
  }
}
