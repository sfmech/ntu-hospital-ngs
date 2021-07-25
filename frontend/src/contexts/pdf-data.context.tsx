import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { Segment } from '../models/segment.model';
import { Sample } from '../models/sample.model';
import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';
import { Aligned } from '../models/aligned.model';
import { ResultOptionReducer } from './result-option.reducer';
import { QueryCondition } from '../models/query.condition.enum';
import { PdfData } from '../models/pdf.model';
import { PdfDataReducer } from './pdf-data.reducer';

const initialState = {
	pdfData: new Array<PdfData>(),
	setData:(data:PdfData[])=>{},
	
};

export const PdfDataContext = createContext(initialState);

export const PdfDataProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(PdfDataReducer, initialState);
	
	function setData(data: PdfData[]) {
        dispatch({
            type: 'SETDATA',
            payload: data
        });
	}

	
	return (
		<PdfDataContext.Provider
			value={{
				pdfData: state.data,
				setData,
			}}
		>
			{children}
		</PdfDataContext.Provider>
	);
};
