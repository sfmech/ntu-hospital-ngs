import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    PassportModule.register({
      property: 'user',
      session: false
    }),
    JwtModule
  ],
  exports: [PassportModule]
})
export class AuthModule { }
