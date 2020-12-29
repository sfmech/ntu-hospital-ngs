import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FrontendModule } from './frontend/frontend.module';
import { AppConfig } from './app.config';
import { NGSBuilderDbModule } from './database/ngs-builder/ngs-builder-db.module';
import { NGSModule } from './next-generation-sequencing/ngs.modules';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      isGlobal: true
    }),
    NGSModule,
    NGSBuilderDbModule,
    AuthModule,
    FrontendModule,
  ]
})
export class AppModule { }

