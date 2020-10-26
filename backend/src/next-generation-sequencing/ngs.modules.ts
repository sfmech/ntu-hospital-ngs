import { Module } from '@nestjs/common';
import { NGSBuilderDbModule } from 'src/database/ngs-builder/ngs-builder-db.module';
import { NGSController } from './controllers/ngs.controller';
import { NGSService } from './services/ngs.service';
import { CsvModule } from 'nest-csv-parser'
@Module({
    imports: [
        CsvModule,
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