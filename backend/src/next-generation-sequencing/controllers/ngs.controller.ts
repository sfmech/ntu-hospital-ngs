import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Coverage } from '../models/coverage.model';
import { Disease } from '../models/disease.model';
import { MutationQC } from '../models/mutationQC.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';
import { SegmentTag } from '../models/segmentTag.model';
import { NGSService } from '../services/ngs.service';

@Controller('api')
export class NGSController {
	constructor(private readonly ngsService: NGSService) {}

	@Get('/segments')
	getAllSegments(): Promise<Segment[]> {
		return this.ngsService.getAllSegments();
	}

	@Get('/samples')
	getAllSamples(): Promise<Sample[]> {
		return this.ngsService.getAllSamples();
	}

	@Get('/coverages')
	getAllCoverage(): Promise<Coverage[]> {
		return this.ngsService.getAllCoverage();
	}

	@Get('/mutationQCs')
	getAllMutationQC(): Promise<MutationQC[]> {
		return this.ngsService.getAllMutationQC();
	}

	@Get('/segmentTags')
	getFilterlist(): Promise<SegmentTag[]> {
		return this.ngsService.getFilterlist();
	}

	@Post('/deleteBlacklist')
	deleteBlacklist(@Body() body): Promise<SegmentTag[]> {
		return this.ngsService.deleteBlacklist(body.data);
	}
	@Post('/deleteWhitelist')
	deleteWhitelist(@Body() body): Promise<SegmentTag[]> {
		return this.ngsService.deleteWhitelist(body.data);
	}

	@Post('/addBlacklist')
	addBlacklist(@Body() body): Promise<SegmentTag[]> {
		const data = body.data.map((element: Segment) => {
			let temp = Object.assign(new SegmentTag(), element);
			temp.category='blacklist';
			return temp;
		});
		 
		return this.ngsService.addBlacklist(data);
	}
	@Post('/addWhitelist')
	addWhitelist(@Body() body): Promise<SegmentTag[]> {
		const data = body.data.map((element: Segment) => {
			let temp = Object.assign(new SegmentTag(), element);
			temp.category='whitelist';
			return temp;
		});
		return this.ngsService.addWhitelist(data);
	}

	@Post('/runscript')
	runscript() {
		return this.ngsService.runScript();
	}

	@Get('/filelist')
	getFilelist() : Promise<{}>{
		return this.ngsService.getFilelist();
	}

	@Get('/resultlist')
	getResultlist() : Promise<Array<string>>{
		return this.ngsService.getResultList();
	}

	@Post('/uploadresult')
	uploadResult(@Body() body) {
		return this.ngsService.uploadResult(body.data);
	}

	@Get('/getDiseases')
	getDiseases(): Promise<Array<Disease>>{
		return this.ngsService.getDiseases();
	}

	@Post('/addDisease')
	addDisease(@Body() body) {
		return this.ngsService.addDisease(body.data);
	}
	@Post('/editSampleDisease')
	editSampleDisease(@Body() body) {
		return this.ngsService.editSampleDisease(body.data);
	}

	@Post('/deleteDisease')
	deleteDisease(@Body() body) {
		return this.ngsService.deleteDisease(body.data);
	}

	@Post('/updateFile')
	updateFile(@Body() body): Promise<void> {
		return this.ngsService.updateFile(body.oldSampleName, body.newSampleName);
	}


}
