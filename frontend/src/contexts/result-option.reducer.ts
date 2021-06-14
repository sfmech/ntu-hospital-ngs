import { Aligned } from '../models/aligned.model';
import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';



export const ResultOptionReducer = (state, action) => {
	switch (action.type) {
		case "SETINPUT":
			return {
                ...state,
                input:  action.payload 
            };
		case "SETCONDITION":
			return {
                ...state,
                condition:  action.payload 
            };
		default:
			return state;
	}
};
