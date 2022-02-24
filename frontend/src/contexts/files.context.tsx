import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { File } from '../models/file.model';
import { FileReducer } from './files.reducer';
// analysis > 0 means how many files analysing
type FileResponse = {
	analysis: number,
	files: Array<File>
}
const initialState = {
	Myeloidanalysis: 0,
	MPNanalysis: 0,
	TP53analysis: 0,
	Myeloidfiles: new Array<File>(),
	MPNfiles: new Array<File>(),
	TP53files: new Array<File>(),
	Mergefiles: new Array<string>(),
	setMyeloidAnalysis: (analysis: number)=>{},
	setMPNAnalysis: (analysis: number)=>{},
	setTP53Analysis: (analysis: number)=>{},
	setMyeloidFiles: (files: Array<File>)=>{},
	setMPNFiles: (files: Array<File>)=>{},
	setTP53Files: (files: Array<File>)=>{},
	setMergeFiles: (files: Array<string>)=>{},
	updateFile: (file: {file:File, bed: string})=>{},
	updateFileInfo: (file: {file:File, bed: string})=>{}
};

export const FileContext = createContext(initialState);

export const FileProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(FileReducer, initialState);

	useEffect(() => {
		const getFilelist = () => {
			try {
				axios(`${ApiUrl}/api/filelist`).then((res) => {
					if (res.data.Myeloid.files.length > 0) {
						setMyeloidFiles(res.data.Myeloid.files);
						setMyeloidAnalysis(parseInt(res.data.Myeloid.analysis));
					}else{
						setMyeloidFiles([]);
						setMyeloidAnalysis(0);
					}
					if (res.data.MPN.files.length > 0) {
						setMPNFiles(res.data.MPN.files);
						setMPNAnalysis(parseInt(res.data.MPN.analysis));
					}else{
						setMPNFiles([]);
						setMPNAnalysis(0);
					}
					if (res.data.TP53.files.length > 0) {
						setTP53Files(res.data.TP53.files);
						setTP53Analysis(parseInt(res.data.TP53.analysis));
					}else{
						setTP53Files([]);
						setTP53Analysis(0);
					}
				});
			} catch (error) {
				console.log(error);
			}
		};
		getFilelist();
		setInterval(() => getFilelist(), 3000);
	}, []);

	function setMergeFiles(files: string[]) {
        dispatch({
            type: 'SETMERGEFILES',
            payload: files
        });
	}

	function setMyeloidFiles(files: File[]) {
        dispatch({
            type: 'SETMYELOIDFILES',
            payload: files
        });
	}
	function setMPNFiles(files: File[]) {
        dispatch({
            type: 'SETMPNFILES',
            payload: files
        });
	}
	function setTP53Files(files: File[]) {
        dispatch({
            type: 'SETTP53FILES',
            payload: files
        });
	}
	
	function setMyeloidAnalysis(analysis: number) {
        dispatch({
            type: 'SETMYELOIDANALYSIS',
            payload: analysis
        });
	}
	function setMPNAnalysis(analysis: number) {
        dispatch({
            type: 'SETMPNANALYSIS',
            payload: analysis
        });
	}
	function setTP53Analysis(analysis: number) {
        dispatch({
            type: 'SETTP53ANALYSIS',
            payload: analysis
        });
	}
	
	function updateFile(file: {file:File, bed: string}) {
        dispatch({
            type: 'UPDATEFILE',
            payload: file
        });
    }

	function updateFileInfo(file: {file:File, bed: string}) {
        dispatch({
            type: 'UPDATEFILEINFO',
            payload: file
        });
    }
	
	
	return (
		<FileContext.Provider
			value={{
				Myeloidanalysis: state.Myeloidanalysis,
				MPNanalysis: state.MPNanalysis,
				TP53analysis: state.TP53analysis,
				Myeloidfiles: state.Myeloidfiles,
				MPNfiles: state.MPNfiles,
				TP53files: state.TP53files,
				Mergefiles: state.Mergefiles,
				setMyeloidAnalysis,
				setMPNAnalysis,
				setTP53Analysis,
				setMyeloidFiles,
				setMPNFiles,
				setTP53Files,
				setMergeFiles,
				updateFile,
				updateFileInfo

			}}
		>
			{children}
		</FileContext.Provider>
	);
};
