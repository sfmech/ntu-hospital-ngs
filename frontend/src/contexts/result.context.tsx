import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { Segment } from '../models/segment.model';
import { ResultReducer } from './result.reducer';
import { Sample } from '../models/sample.model';
import { Coverage } from '../models/coverage.model';
import { MutationQC } from '../models/mutationQC.model';
import { Aligned } from '../models/aligned.model';

const initialState = {
	segmentResults: {} as Record<string, Segment[]>,
	sampleResults: {} as Record<string, Sample[]>,
	coverageResults: {} as Record<string, Coverage[]>,
	mutationQCResults: {} as Record<string, MutationQC[]>,
	alignedResults: {} as Record<string, Aligned[]>,
	setSamples: (samples: Sample[]) => {},
	setSegments: (segments: Segment[]) => {},
	setCoverages: (coverages: Coverage[]) => {},
	setMutationQCs: (mutationQCs: MutationQC[]) => {},
	setAligneds: (aligneds: Aligned[]) => {},
	updateSegment: (segment: Segment) => {},
};

export const ResultContext = createContext(initialState);

export const ResultProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(ResultReducer, initialState);
	
	useEffect(() => {
		const getAllSamples = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/samples`);
				setSamples(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllSegments = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/segments`);
				setSegments(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		const getAllCoverages = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/coverages`);
				setCoverages(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllMutationQCs = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/mutationQCs`);
				setMutationQCs(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllAligneds = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/aligned`);
				setAligneds(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getAllSamples();
		getAllSegments();
		getAllCoverages();
		getAllMutationQCs();
		getAllAligneds();
	}, []);

	function setSamples(samples: Sample[]) {
        dispatch({
            type: 'SETSAMPLES',
            payload: samples
        });
	}

	function setSegments(segments: Segment[]) {
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
	function setAligneds(aligneds: Aligned[]) {
        dispatch({
            type: 'SETALIGNEDS',
            payload: aligneds
        });
	}

	function updateSegment(segment: Segment) {
        dispatch({
            type: 'UPDATESEGMENT',
            payload: segment
        });
	}
	return (
		<ResultContext.Provider
			value={{
				sampleResults: state.sampleResults,
				segmentResults: state.segmentResults,
				mutationQCResults: state.mutationQCResults,
				coverageResults: state.coverageResults,
				alignedResults: state.alignedResults,
				setSamples,
				setSegments,
				setMutationQCs,
				setCoverages,
				setAligneds,
				updateSegment
			}}
		>
			{children}
		</ResultContext.Provider>
	);
};
