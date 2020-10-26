import { Module } from '@nestjs/common';
import { NGSBuilderDbModule } from 'src/database/ngs-builder/ngs-builder-db.module';
import { NGSController } from './controllers/ngs.controller';
import { NGSService } from './services/ngs.service';
@Module({
    imports: [
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