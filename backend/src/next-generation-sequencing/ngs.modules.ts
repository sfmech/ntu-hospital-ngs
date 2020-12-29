import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from 'src/auth/jwt/jwt.module';
import { NGSBuilderDbModule } from 'src/database/ngs-builder/ngs-builder-db.module';
import { LoggerModule } from 'src/logger/logger.module';
import { NgsConfig } from './config/ngs.config';
import { NGSController } from './controllers/ngs.controller';
import { NGSService } from './services/ngs.service';
@Module({
    imports: [
        JwtModule,
        ConfigModule.forFeature(NgsConfig),
        LoggerModule,
        NGSBuilderDbModule
    ],
    controllers: [
        NGSController
    ],
    providers: [
        NGSService
    ]
  })
  export class NGSModule { }