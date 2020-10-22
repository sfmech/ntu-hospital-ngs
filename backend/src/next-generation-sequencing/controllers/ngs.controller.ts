import { Controller, Get, Param } from '@nestjs/common';
import { Run } from '../models/run.model';
import { Sample } from '../models/sample.model';
import { NGSService } from '../services/ngs.service';

@Controller('api')
export class NGSController {
  constructor(private readonly ngsService: NGSService) {}

  @Get('/runs')
  getRuns(): Promise<Run[]> {
    return this.ngsService.getRuns();
  }

  @Get('/samples:id')
  getSamples( @Param('id') id: number): Promise<Sample[]> {
    return this.ngsService.getSamples(id);
  }
}
