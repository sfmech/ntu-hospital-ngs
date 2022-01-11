import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { File } from '../models/file.model';
import { FileReducer } from './files.reducer';
// analysis > 0 means how many files analysing
type FileResponse = {
	analysis: number,
	files: Array<File>
	bed: Array<string>
}
const initialState = {
	analysis: 0,
	files: new Array<File>(),
	beds: new Array<string>(),
	setAnalysis: (analysis: number)=>{},
	setFiles: (files: Array<File>)=>{},
	setBeds: (beds: Array<string>)=>{},
	updateFile: (file: File)=>{},
	updateFileInfo: (file: File)=>{}
};

export const FileContext = createContext(initialState);

export const FileProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(FileReducer, initialState);

	useEffect(() => {
		const getFilelist = () => {
			try {
				axios(`${ApiUrl}/api/filelist`).then((res) => {
					console.log(res);
					if (res.data.files.length > 0) {
						setFiles(res.data.files);
						setAnalysis(parseInt(res.data.analysis));
					}
					setBeds(res.data.bed);
				});
			} catch (error) {
				console.log(error);
			}
		};
		getFilelist();
		setInterval(() => getFilelist(), 3000);
	}, []);

	function setFiles(files: File[]) {
        dispatch({
            type: 'SETFILES',
            payload: files
        });
	}
	function setBeds(beds: string[]) {
        dispatch({
            type: 'SETBEDS',
            payload: beds
        });
	}
	function setAnalysis(analysis: number) {
        dispatch({
            type: 'SETANALYSIS',
            payload: analysis
        });
	}
	
	function updateFile(file: File) {
        dispatch({
            type: 'UPDATEFILE',
            payload: file
        });
    }

	function updateFileInfo(file: File) {
        dispatch({
            type: 'UPDATEFILEINFO',
            payload: file
        });
    }
	
	
	return (
		<FileContext.Provider
			value={{
				analysis: state.analysis,
				files: state.files,
				beds: state.beds,
				setAnalysis,
				setFiles,
				setBeds,
				updateFile,
				updateFileInfo

			}}
		>
			{children}
		</FileContext.Provider>
	);
};
