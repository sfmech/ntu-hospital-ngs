import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
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

	@Get('/runscript')
	runscript() {
		return this.ngsService.runScript();
	}
}
