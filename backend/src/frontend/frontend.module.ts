/**
 * https://docs.nestjs.com/recipes/serve-static
 */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { JwtMiddleware } from 'src/auth/jwt/jwt.middleware';
import { JwtModule } from 'src/auth/jwt/jwt.module';

const excludeApiPath = [
  '/api/(.*)',
  '/auth/(.*)',
];
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '../../../frontend/build'),
      exclude: excludeApiPath,
    }),
    JwtModule
  ]
})

export class FrontendModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: '/static/(.*).css', method: RequestMethod.GET },
        { path: '/(.*).json', method: RequestMethod.GET },
        { path: '/assets/(.*).png', method: RequestMethod.GET },
        { path: '/(.*).png', method: RequestMethod.GET },
        ...excludeApiPath.map((path) => ({ path, method: RequestMethod.ALL })),
      )
      .forRoutes('/');
  }
}
