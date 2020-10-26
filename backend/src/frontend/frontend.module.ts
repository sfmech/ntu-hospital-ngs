/**
 * https://docs.nestjs.com/recipes/serve-static
 */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

const excludeApiPath = [
  '/api/(.*)',
];
@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: path.join(__dirname, '../../../frontend/build'),
      exclude: excludeApiPath,
    })
  ]
})

export class FrontendModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply()
      .exclude(
        { path: '/static/(.*).css', method: RequestMethod.GET },
        ...excludeApiPath.map((path) => ({ path, method: RequestMethod.ALL })),
      )
      .forRoutes('/');
  }
}
