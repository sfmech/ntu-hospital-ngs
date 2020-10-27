import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Run as RunEntity } from 'src/database/ngs-builder/entities/run.entity';
import { Sample as SampleEntity } from 'src/database/ngs-builder/entities/sample.entity';
import { Segment as SegmentEntity } from 'src/database/ngs-builder/entities/segment.entity';
import { SegmentTag as SegmentTagEntity } from 'src/database/ngs-builder/entities/segmentTag.entity';
import { Repository } from 'typeorm';

import { Run } from '../models/run.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';
import { SegmentTag } from '../models/segmentTag.model';
var cp = require('child_process');
const fs = require('fs');
const csv = require('csv-parser');

@Injectable()
export class NGSService {
	constructor(
		@InjectRepository(RunEntity) private runRepository: Repository<RunEntity>,
		@InjectRepository(SampleEntity) private sampleRepository: Repository<SampleEntity>,
		@InjectRepository(SegmentEntity) private segmentRepository: Repository<SegmentEntity>,
		@InjectRepository(SegmentTagEntity) private segmentTagRepository: Repository<SegmentTagEntity>,
		private configService: ConfigService
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

	async getFilelist(): Promise<string[]> {
		const bams = fs
			.readdirSync(this.configService.get<string>('ngs.path'))
			.filter((bam: string) => bam.match(/(\d)*_S(\d)*.bam/))
			.map((file: string) => `${file.split('.')[0]}`);
		const annotations = fs
			.readdirSync(this.configService.get<string>('ngs.path'))
			.filter((annotation: string) => annotation.match(/(\d)*_S(\d)*_Annotation.csv/))
			.map((file: string) => `${file.split('_')[0]}_${file.split('_')[1]}`);
		const files = fs
			.readdirSync(this.configService.get<string>('ngs.path'))
			.filter((file: string) => file.match(/(\d)*_S(\d)*_L001_R1_001.fastq.gz/))
			.map((file: string) => `${file.split('_')[0]}_${file.split('_')[1]}`)
			.filter((element, index, arr) => arr.indexOf(element) === index);

		const response = files.map((file) => {
			if (annotations.includes(file)) {
				return { status: 1, name: file };
			} else if (bams.includes(file)) {
				return { status: 2, name: file };
			} else {
				return { status: 0, name: file };
			}
		});
		return response;
	}

	async runScript(): Promise<void> {
		const files = fs
			.readdirSync(this.configService.get<string>('ngs.path'))
			.filter((file: string) => file.match(/(\d)*_S(\d)*_L001_R1_001.fastq.gz/));

		var child = cp.execFile('bash', [ `/home/pindel/Leukemia_analysis_with_large_indels.bash` ],{maxBuffer: 1024 * 500});
		child.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		child.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});

		child.on('close', async (code) => {
			const now = new Date(Date.now());
			const runResults = {
				runName: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}`
			};
			const runsResponse = await this.runRepository.save(runResults);
			console.log(runsResponse);

			const sampleResults = files.map((file) => {
				const temp = new Sample();
				temp.sampleName = `${file.split('_')[0]}_${file.split('_')[1]}`;
				temp.run.runId = runsResponse.runId;
				return temp;
			});
			const samplesResponse = await this.sampleRepository.save(sampleResults);
			samplesResponse.forEach((element: Sample, index: number) => {
				const segmentResults = new Array<Segment>();
				try {
					const stream = fs
						.createReadStream(
							`${this.configService.get<string>(
								'ngs.path'
							)}/${runsResponse.runName}/${element.sampleName}_Annotation.csv`
						)
						.pipe(csv())
						.on('data', (data) => {
							let temp = new Segment();
							if (
								(data['Annotation'] || ('' as string)).indexOf('stop') !== -1 ||
								(data['Annotation'] || ('' as string)).indexOf('missense') !== -1 ||
								(data['Annotation'] || ('' as string)).indexOf('frameshift') !== -1 ||
								(data['Annotation'] || ('' as string)).indexOf('splice') !== -1
							) {
								temp.chr = data['Chr'] || '';
								temp.position = data['Position'] || '';
								temp.dbSNP = data['dbSNP'] || '';
								temp.freq = parseFloat((data['Freq'] || '0%').split('%')[0]);
								temp.depth = parseInt(data['Depth']);
								temp.annotation = data['Annotation'] || '';
								temp.geneName = data['Gene_Name'] || '';
								temp.HGVSc = data['HGVS.c'] || '';
								temp.HGVSp = data['HGVS.p'] || '';
								if (
									(data['Clinical significance'] + data['Disease'] || '').indexOf('Pathogenic') !== -1
								) {
									temp.clinicalSignificance = 'Pathogenic';
								} else if (
									(data['Clinical significance'] + data['Disease'] || '').indexOf('Benign') !== -1
								) {
									temp.clinicalSignificance = 'Benign';
								} else if (
									(data['Clinical significance'] + data['Disease'] || '')
										.indexOf('uncertain significant') !== -1
								) {
									temp.clinicalSignificance = 'uncertain significant';
								} else if (
									(data['Clinical significance'] + data['Disease'] || '').indexOf('not_provided') !==
									-1
								) {
									temp.clinicalSignificance = 'not_provided';
								} else {
									temp.clinicalSignificance = '';
								}
								if (parseFloat(data['Global_AF'])) temp.globalAF = parseFloat(data['Global_AF']);
								if (parseFloat(data['AFR_AF'])) temp.AFRAF = parseFloat(data['AFR_AF']);
								if (parseFloat(data['AMR_AF'])) temp.AMRAF = parseFloat(data['AMR_AF']);
								if (parseFloat(data['EUR_AF'])) temp.EURAF = parseFloat(data['EUR_AF']);
								if (parseFloat(data['ASN_AF'])) temp.ASNAF = parseFloat(data['ASN_AF']);
							}
							if (temp.clinicalSignificance !== '') {
								if (temp.freq > 5) {
									temp.sample.sampleId = element.sampleId;
									segmentResults.push(temp);
								} else if (temp.freq >= 3 && temp.clinicalSignificance === 'Pathogenic') {
									temp.sample.sampleId = element.sampleId;
									segmentResults.push(temp);
								}
							}
						})
						.on('end', async () => {
							console.log(segmentResults);
							const samplesResponse = await this.segmentRepository.save(segmentResults);
						});
				} catch (error) {
					console.log('error', error);
				}
			});
			console.log(`子进程退出，退出码 ${code}`);
		});
	}

	saveResult(): void {}
}
