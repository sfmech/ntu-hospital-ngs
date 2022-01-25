import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Coverage } from '../models/coverage.model';
import { Disease } from '../models/disease.model';
import { MutationQC } from '../models/mutationQC.model';
import { Run } from '../models/run.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';
import { SegmentTag } from '../models/segmentTag.model';
import { NGSService } from '../services/ngs.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../models/user.model';
import { CustomJwtService } from 'src/auth/jwt/jwt.service';
import { response } from 'express';
import { Aligned } from '../models/aligned.model';

@Controller('api')
export class NGSController {
	constructor(private readonly ngsService: NGSService, private jwtService: CustomJwtService) {}

	@Get('/init')
	@UseGuards(AuthGuard('jwt'))
	async getAll(): Promise<{ 'samples': Sample[]; segments: Segment[]; coverage: Coverage[]; mutationQC: MutationQC[]; aligned: Aligned[] }> {
		return {samples: await this.ngsService.getAllSamples(), segments: await this.ngsService.getAllSegments(), coverage: await this.ngsService.getAllCoverage(), mutationQC: await this.ngsService.getAllMutationQC(), aligned: await this.ngsService.getAllAligned()};
	}

	@Get('/runs')
	@UseGuards(AuthGuard('jwt'))
	getAllRuns(): Promise<Run[]> {
		return this.ngsService.getAllRuns();
	}

	@Get('/segments')
	@UseGuards(AuthGuard('jwt'))
	getAllSegments(): Promise<Segment[]> {
		return this.ngsService.getAllSegments();
	}

	@Get('/samples')
	@UseGuards(AuthGuard('jwt'))
	getAllSamples(): Promise<Sample[]> {
		return this.ngsService.getAllSamples();
	}

	@Post('/deleteSamples')
	@UseGuards(AuthGuard('jwt'))
	deleteSamples(@Body() body): Promise<Sample[]> {
		return this.ngsService.deleteSamples(body.data.sampleIds, body.data.runIds);
	}

	@Post('/updatesegment')
	@UseGuards(AuthGuard('jwt'))
	updateSegment(@Body() body): Promise<Segment[]> {
		return this.ngsService.updateSegment(body.data);
	}

	@Get('/coverages')
	@UseGuards(AuthGuard('jwt'))
	getAllCoverage(): Promise<Coverage[]> {
		return this.ngsService.getAllCoverage();
	}

	@Get('/aligned')
	@UseGuards(AuthGuard('jwt'))
	getAllaligned(): Promise<Aligned[]> {
		return this.ngsService.getAllAligned();
	}

	@Get('/mutationQCs')
	@UseGuards(AuthGuard('jwt'))
	getAllMutationQC(): Promise<MutationQC[]> {
		return this.ngsService.getAllMutationQC();
	}

	@Get('/segmentTags')
	@UseGuards(AuthGuard('jwt'))
	getFilterlist(): Promise<SegmentTag[]> {
		return this.ngsService.getFilterlist();
	}

	@Post('/deleteBlacklist')
	@UseGuards(AuthGuard('jwt'))
	deleteBlacklist(@Body() body): Promise<SegmentTag[]> {
		return this.ngsService.deleteFilterlist(body.data);
	}
	@Post('/deleteWhitelist')
	@UseGuards(AuthGuard('jwt'))
	deleteWhitelist(@Body() body): Promise<SegmentTag[]> {
		return this.ngsService.deleteFilterlist(body.data);
	}
	@Post('/deleteHotspotlist')
	@UseGuards(AuthGuard('jwt'))
	deleteHotspotlist(@Body() body): Promise<SegmentTag[]> {
		return this.ngsService.deleteFilterlist(body.data);
	}

	@Post('/addHotspotlist')
	@UseGuards(AuthGuard('jwt'))
	addHotspotlist(@Req() request, @Body() body): Promise<SegmentTag[]> {
		const payload: User = this.jwtService.verifyToken(request.cookies['jwt-auth-token']);

		const data = body.data.map((element: Segment) => {
			let temp = Object.assign(new SegmentTag(), element);
			temp.category = 'hotspotlist';
			return temp;
		});

		return this.ngsService.addFilterlist(data, payload.userName);
	}

	@Post('/addBlacklist')
	@UseGuards(AuthGuard('jwt'))
	addBlacklist(@Req() request, @Body() body): Promise<SegmentTag[]> {
		const payload: User = this.jwtService.verifyToken(request.cookies['jwt-auth-token']);

		const data = body.data.map((element: Segment) => {
			let temp = Object.assign(new SegmentTag(), element);
			temp.category = 'blacklist';
			return temp;
		});

		return this.ngsService.addFilterlist(data, payload.userName);
	}
	@Post('/addWhitelist')
	@UseGuards(AuthGuard('jwt'))
	addWhitelist(@Req() request, @Body() body): Promise<SegmentTag[]> {
		const payload: User = this.jwtService.verifyToken(request.cookies['jwt-auth-token']);

		const data = body.data.map((element: Segment) => {
			let temp = Object.assign(new SegmentTag(), element);
			temp.category = 'whitelist';
			return temp;
		});
		return this.ngsService.addFilterlist(data, payload.userName);
	}

	@Post('/updateSegmentTag')
	@UseGuards(AuthGuard('jwt'))
	updateSegmentTag(@Req() request, @Body() body): Promise<SegmentTag[]> {
		return this.ngsService.updateSegmentTag(body.data);
	}

	@Post('/updateRun')
	@UseGuards(AuthGuard('jwt'))
	updateRun(@Body() body): Promise<Run[]> {
		return this.ngsService.updateRun(body.data);
	}

	@Post('/updateSample')
	@UseGuards(AuthGuard('jwt'))
	updateSample(@Body() body): Promise<Sample[]> {
		return this.ngsService.updateSample(body.data);
	}

	@Post('/runscript')
	@UseGuards(AuthGuard('jwt'))
	runscript(@Req() request, @Body() body) {
		//console.log(body.data);
		return this.ngsService.runScript(body.data, body.bed);
	}

	@Get('/filelist')
	@UseGuards(AuthGuard('jwt'))
	getFilelist(): Promise<{}> {
		return this.ngsService.getFilelist();
	}

	@Get('/resultlist')
	@UseGuards(AuthGuard('jwt'))
	getResultlist() {
		return this.ngsService.getResultList();
	}

	@Post('/uploadresult')
	@UseGuards(AuthGuard('jwt'))
	uploadResult(@Body() body) {
		return this.ngsService.uploadResult(body.data, body.bed);
	}

	@Get('/getDiseases')
	@UseGuards(AuthGuard('jwt'))
	getDiseases(): Promise<Array<Disease>> {
		return this.ngsService.getDiseases();
	}

	@Post('/addDisease')
	@UseGuards(AuthGuard('jwt'))
	addDisease(@Body() body) {
		return this.ngsService.addDisease(body.data);
	}
	@Post('/editSampleDisease')
	@UseGuards(AuthGuard('jwt'))
	editSampleDisease(@Body() body) {
		return this.ngsService.editSampleDisease(body.data);
	}

	@Post('/deleteDisease')
	@UseGuards(AuthGuard('jwt'))
	deleteDisease(@Body() body) {
		return this.ngsService.deleteDisease(body.data);
	}

	@Post('/updateFile')
	@UseGuards(AuthGuard('jwt'))
	updateFile(@Body() body): Promise<void> {
		return this.ngsService.updateFile(body.oldSampleName, body.newSampleName, body.bed);
	}

	@Get('/getMemberlist')
	@UseGuards(AuthGuard('jwt'))
	async getMemberlist(@Req() request) {
		const payload: User = this.jwtService.verifyToken(request.cookies['jwt-auth-token']);
		let memberlist = [];
		if (payload.userRole==="admin"){
			memberlist = await this.ngsService.getMemberlist();
		}
		return memberlist;
	}

	@Post('/addUser')
	@UseGuards(AuthGuard('jwt'))
	addUser(@Req() request, @Res() response, @Body() body) {
		const payload: User = this.jwtService.verifyToken(request.cookies['jwt-auth-token']);
		if (payload.userRole!=="admin"){
			return response.redirect('/',HttpStatus.UNAUTHORIZED);
		}
		this.ngsService.addUser(body.data)
		response.status(HttpStatus.OK)
		return response.send();
	}

	@Post('/deleteUser')
	@UseGuards(AuthGuard('jwt'))
	deleteUser(@Body() body) {
		return this.ngsService.deleteUser(body.data);
	}

	@Get('/getHealthCareWorkers')
	@UseGuards(AuthGuard('jwt'))
	async getHealthCareWorkers(@Req() request) {
		return this.ngsService.getHealthCareWorkers();
	}

	@Post('/addHealthCareWorkers')
	@UseGuards(AuthGuard('jwt'))
	addHealthCareWorkers(@Req() request, @Res() response, @Body() body) {
		response.status(HttpStatus.OK)
		this.ngsService.addHealthCareWorkers(body.data);
		return response.send();
	}

	@Post('/deleteHealthCareWorkers')
	@UseGuards(AuthGuard('jwt'))
	deleteHealthCareWorkers(@Body() body) {
		return this.ngsService.deleteHealthCareWorkers(body.data);
	}

	@Get('/getbamfile/:samplename/:runname')
	@UseGuards(AuthGuard('jwt'))
	getBamFile(@Res() response, @Body() body, @Param('samplename') sampleName: string, @Param('runname') runName: string){
		const data =  this.ngsService.getBamFile(sampleName, runName);
		response.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename=${sampleName}.bam`,
			'Content-Length': data[1]
		  });
		
		
		return data[0].pipe(response);
	}

	@Get('/getbaifile/:samplename/:runname')
	@UseGuards(AuthGuard('jwt'))
	getBaiFile(@Res() response, @Body() body, @Param('samplename') sampleName: string, @Param('runname') runName: string){
		const data =  this.ngsService.getBaiFile(sampleName, runName);
		response.writeHead(200, {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename=${sampleName}.bam.bai`,
			'Content-Length': data[1]
		  });
		
		return data[0].pipe(response);
	}
}
