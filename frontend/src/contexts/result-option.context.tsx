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

const initialState = {
	input: "" as string,
	condition: QueryCondition.SampleName,
	setInput:(input:string)=>{},
	setCondition:(condition:string)=>{}
};

export const ResultOptionContext = createContext(initialState);

export const ResultOptionProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(ResultOptionReducer, initialState);
	
	function setInput(input: string) {
        dispatch({
            type: 'SETINPUT',
            payload: input
        });
	}

	function setCondition(condition: string) {
        dispatch({
            type: 'SETCONDITION',
            payload: condition
        });
	}

	return (
		<ResultOptionContext.Provider
			value={{
				input: state.input,
				condition: state.condition,
				setInput,
				setCondition
			}}
		>
			{children}
		</ResultOptionContext.Provider>
	);
};
