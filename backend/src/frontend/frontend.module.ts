/**
 * https://docs.nestjs.com/recipes/serve-static
 */
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/',
      rootPath: path.join(__dirname, '../../../frontend/build')
    })
  ]
})
export class FrontendModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply()
      .exclude(
        { path: '/static/(.*).css', method: RequestMethod.GET }
      )
      .forRoutes('/');
  }
}
