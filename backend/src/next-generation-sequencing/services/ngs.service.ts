import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Run as RunEntity } from 'src/database/ngs-builder/entities/run.entity';
import { Sample as SampleEntity } from 'src/database/ngs-builder/entities/sample.entity';
import { Segment as SegmentEntity } from 'src/database/ngs-builder/entities/segment.entity';
import { SegmentTag as SegmentTagEntity } from 'src/database/ngs-builder/entities/segmentTag.entity';
import { Repository } from 'typeorm';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import { Run } from '../models/run.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';
import { SegmentTag } from '../models/segmentTag.model';
var cp = require('child_process');
const fs = require('fs');

class Entity {
	Chr: string;
	Position: string;
	dbSNP: string;
	Ref: string;
	Alt: string;
	Freq: number;
	Depth: number;
	Annotation: string;
	Gene_Name: string;
	'HGVS.c': string;
	'HGVS.p': string;

	Global_AF: number;
	AFR_AF: number;
	AMR_AF: number;
	EUR_AF: number;
	ASN_AF: number;
	'Clinical significance': string;
	Disease: string;
}

@Injectable()
export class NGSService {
	constructor(
		@InjectRepository(RunEntity) private runRepository: Repository<RunEntity>,
		@InjectRepository(SampleEntity) private sampleRepository: Repository<SampleEntity>,
		@InjectRepository(SegmentEntity) private segmentRepository: Repository<SegmentEntity>,
		@InjectRepository(SegmentTagEntity) private segmentTagRepository: Repository<SegmentTagEntity>,
		private readonly csvParser: CsvParser
	) {}

	async getAllSegments(): Promise<Segment[]> {
		const segments = await this.segmentRepository.find();
		return segments;
	}
	async getAllSamples(): Promise<Sample[]> {
		const samples = await this.sampleRepository.find();
		return samples;
	}

	async getFilterlist(): Promise<SegmentTag[]> {
		const segmentTags = await this.segmentTagRepository.find();
		const segmentTagsModel = segmentTags.map((segmentTag) => {
			let temp = Object.assign(new SegmentTag(), segmentTag);
			temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
			return temp;
		});

		return segmentTagsModel;
	}

	async deleteBlacklist(deleteSegmentTags: SegmentTag[]): Promise<SegmentTag[]> {
		const blacklist = await this.segmentTagRepository.remove(deleteSegmentTags);
		const segmentTagsModel = blacklist.map((segmentTag) => {
			let temp = Object.assign(new SegmentTag(), segmentTag);
			temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
			return temp;
		});
		return segmentTagsModel;
	}
	async deleteWhitelist(deleteSegmentTags: SegmentTag[]): Promise<SegmentTag[]> {
		const whitelist = await this.segmentTagRepository.remove(deleteSegmentTags);
		const segmentTagsModel = whitelist.map((segmentTag) => {
			let temp = Object.assign(new SegmentTag(), segmentTag);
			temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
			return temp;
		});
		return segmentTagsModel;
	}

	async addBlacklist(addSegmentTags: SegmentTag[]): Promise<SegmentTag[]> {
		const blacklist = await this.segmentTagRepository.save(addSegmentTags);
		return blacklist;
	}
	async addWhitelist(addSegmentTags: SegmentTag[]): Promise<SegmentTag[]> {
		const whitelist = await this.segmentTagRepository.save(addSegmentTags);
		return whitelist;
	}
	async runScript(): Promise<void> {
		/*const stream = fs.createReadStream('D:\\NGS_Analysis\\2020-10-20-15\\1137_S8_Annotation.csv');
		const entities: ParsedData<Entity> = await this.csvParser.parse(stream, Entity, null, null, {
			strict: false,
			separator: ';'
		});*/
		
		const test = fs.readdirSync('~/Data').filter((file: string) => file.match(/(\d)*_S(\d)*_L001_R1_001.fastq.gz/))
		var child = cp.exec('bash ~/Leukemia_analysis_with_large_indels.bash');
		child.stdout.on('data', function(data) {
			console.log(data);
		});
		
	}

	saveResult(): void {}
}
