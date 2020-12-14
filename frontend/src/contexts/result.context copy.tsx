import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { Segment } from '../models/segment.model';
import { ResultReducer } from './result.reducer';
import { Sample } from '../models/sample.model';
import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';

const initialState = {
	segmentResults: {} as Record<string, Segment>,
	sampleResults: {} as Record<string, Sample>,
	coverageResults: {} as Record<string, Coverage>,
	mutationQCResults: {} as Record<string, MutationQC>,
	
};

export const ResultContext = createContext(initialState);

export const ResultProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(ResultReducer, initialState);
	
	useEffect(() => {
		const getAllSamples = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/samples`);
				const groupData = response.data.reduce((groups, item) => {
					const val = `${item.run.runId}`;
					groups[val] = groups[val] || [];
					groups[val].push(item);
					return groups;
				}, {})
				setSamples(groupData);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllSegments = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/segments`);
				const groupData = response.data.reduce((groups, item) => {
					const val = `${item.sample.sampleId}`;
					groups[val] = groups[val] || [];
					groups[val].push(item);
					return groups;
				}, {})
				setSegments(groupData);
			} catch (error) {
				console.log(error);
			}
		};

		const getAllCoverages = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/coverages`);
				const groupData = response.data.reduce((groups, item) => {
					const val = `${item.sample.sampleId}`;
					groups[val] = groups[val] || [];
					groups[val].push(item);
					return groups;
				}, {})
				setCoverages(groupData);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllMutationQCs = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/mutationQCs`);
				const groupData = response.data.reduce((groups, item) => {
					const val = `${item.sample.sampleId}`;
					groups[val] = groups[val] || [];
					groups[val].push(item);
					return groups;
				}, {})
				setMutationQCs(groupData);
			} catch (error) {
				console.log(error);
			}
		};
		getAllSamples();
		getAllSegments();
		getAllCoverages();
		getAllMutationQCs();
	}, []);

	function setSamples(samples: Record<string, Sample>) {
        dispatch({
            type: 'SETSAMPLES',
            payload: samples
        });
	}

	function setSegments(segments: Record<string, Segment>) {
        dispatch({
            type: 'SETSEGMENTS',
            payload: segments
        });
	}

	function setCoverages(coverages: Coverage[]) {
        dispatch({
            type: 'SETCOVERAGES',
            payload: coverages
        });
	}

	function setMutationQCs(mutationQCs: MutationQC[]) {
        dispatch({
            type: 'SETMUTATIONQCS',
            payload: mutationQCs
        });
	}
	return (
		
			{children}
		
	);
};
