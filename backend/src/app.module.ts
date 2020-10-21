import { Module } from '@nestjs/common';
import { FrontendModule } from './frontend/frontend.module';
import { NGSModule } from './next-generation-sequencing/ngs.modules';

@Module({
  imports: [
    NGSModule,
    FrontendModule,
  ]
})
export class AppModule {}
