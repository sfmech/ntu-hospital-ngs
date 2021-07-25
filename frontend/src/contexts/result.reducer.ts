import { Aligned } from '../models/aligned.model';
import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';

export const ResultReducer = (state, action) => {
	switch (action.type) {
		case "SETREFRESH":
			return {
				...state,
				refresh: action.payload
			};  
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
		case "SETALIGNEDS":
			const ungroupAligneds = action.payload as Aligned[];
			const groupAligneds=ungroupAligneds.reduce((groups, item) => {
				const val = item.sample.sampleId;
				groups[val] = groups[val] || [];
				groups[val].push(item);
				return groups;
			}, {})
			return {
				...state,
				alignedResults: groupAligneds
			};  
		case "UPDATESEGMENT":
			const updatedSegment = action.payload as Segment;
			const updatedSegmentResults = state.segmentResults;
            const updatedSegments = state.segmentResults[updatedSegment.sample.sampleId].map((segment: Segment) => {
                if (segment.segmentId === updatedSegment.segmentId) {
                    return updatedSegment;
                }
                
                return segment;
			});
			updatedSegmentResults[updatedSegment.sample.sampleId] = updatedSegments
			/*
			const updatedSegmentResults = (segmentResults, sampleId)=>{
				segmentResults[sampleId].forEach((segment: Segment, index: number, array: Segment[]) => {
					if (index === updatedSegment.segmentId) {
						array[index] = updatedSegment
					}	
				});	
				return segmentResults
			};
			*/
			return {
				...state,
				segmentResults: {...updatedSegmentResults}
			};  
		default:
			return state;
	}
};
