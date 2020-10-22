import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Run as RunEntity } from 'src/database/ngs-builder/entities/run.entity';
import { Sample as SampleEntity } from 'src/database/ngs-builder/entities/sample.entity';
import { Repository } from 'typeorm';
import { Run } from '../models/run.model';
import { Sample } from '../models/sample.model';
var cp = require('child_process');

@Injectable()
export class NGSService {
	constructor(
		@InjectRepository(RunEntity) private runRepository: Repository<RunEntity>,
		@InjectRepository(SampleEntity) private sampleRepository: Repository<SampleEntity>
	) {}

	async getRuns(): Promise<Run[]> {
		const runs = await this.runRepository.find();
		return runs;
	}

	async getSamples(runId: number): Promise<Sample[]> {
		const samples = await this.sampleRepository.find({ where: { run: runId } });

		return samples;
	}

	runScript(): void {
		/*var child = cp.spawn('bash ~/Leukemia_analysis_with_large_indels.bash');
    child.on('error', function(err) {
      console.log('error: ' + err);
    });
    child.stdout.on('data', function(data) {
      console.log(data);
    });*/
  }
  
  saveResult(): void {}
}
