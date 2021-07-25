import { Aligned } from '../models/aligned.model';
import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';
import { Sample } from '../models/sample.model';
import { Segment } from '../models/segment.model';



export const PdfDataReducer = (state, action) => {
	switch (action.type) {
		case "SETDATA":
			return {
                ...state,
                data:  action.payload 
            };
		default:
			return state;
	}
};
