import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';
import { SegmentTag } from '../models/segmentTag.model';

export const ResultReducer = (state, action) => {
	switch (action.type) {
		case "SETSAMPLES":
			const ungroupSamples = action.payload as Sample[];
			const groupSamples=ungroupSamples.reduce((groups, item) => {
				const val = item.run.runId;
				groups[val] = groups[val] || [];
				groups[val].push(item);
				return groups;
			}, {})
			return {
				...state,
				sampleResults: groupSamples 
			};  
		case "SETSEGMENTS":
			const ungroupSegments = action.payload as Segment[];
			const groupSegments=ungroupSegments.reduce((groups, item) => {
				const val = item.sample.sampleId;
				groups[val] = groups[val] || [];
				groups[val].push(item);
				return groups;
			}, {})
			return {
				...state,
				segmentResults: groupSegments
			};  
		case "SETMUTATIONQCS":
			const ungroupMutationQCs = action.payload as MutationQC[];
			const groupMutationQCs=ungroupMutationQCs.reduce((groups, item) => {
				const val = item.sample.sampleId;
				groups[val] = groups[val] || [];
				groups[val].push(item);
				return groups;
			}, {})
			return {
				...state,
				mutationQCResults: groupMutationQCs
			};  
		case "SETCOVERAGES":
			const ungroupCoverages = action.payload as Coverage[];
			const groupCoverages=ungroupCoverages.reduce((groups, item) => {
				const val = item.sample.sampleId;
				groups[val] = groups[val] || [];
				groups[val].push(item);
				return groups;
			}, {})
			return {
				...state,
				coverageResults: groupCoverages
			};  
		default:
			return state;
	}
};
