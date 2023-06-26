import { File } from "../models/file.model";
import axios from 'axios';
import { ApiUrl } from '../constants/constants';

export const FileReducer = (state, action) => {
	switch (action.type) {
		case 'SETMYELOIDFILES':
			const newMyeloidFile = action.payload as File[];
			const resultsMyeloid = newMyeloidFile.filter(({ name: id1 }) => !state.Myeloidfiles.some(({ name: id2 }) => id2 === id1));
			const results2Myeloid = state.Myeloidfiles.filter(({ name: id1 }) => !newMyeloidFile.some(({ name: id2 }) => id2 === id1));
			if (resultsMyeloid.length > 0 || results2Myeloid.length > 0) {
				return {
					...state,
					Myeloidfiles: action.payload
				};
			} else {
				return state;
			}
		case 'SETMPNFILES':
			const newMPNFile = action.payload as File[];
			const resultsMPN = newMPNFile.filter(({ name: id1 }) => !state.MPNfiles.some(({ name: id2 }) => id2 === id1));
			const results2MPN = state.MPNfiles.filter(({ name: id1 }) => !newMPNFile.some(({ name: id2 }) => id2 === id1));
			if (resultsMPN.length > 0 || results2MPN.length > 0) {
				return {
					...state,
					MPNfiles: action.payload
				};
			} else {
				return state;
			}
		case 'SETTP53FILES':
			const newTP53File = action.payload as File[];
			const resultsTP53 = newTP53File.filter(({ name: id1 }) => !state.TP53files.some(({ name: id2 }) => id2 === id1));
			const results2TP53 = state.TP53files.filter(({ name: id1 }) => !newTP53File.some(({ name: id2 }) => id2 === id1));
			if (resultsTP53.length > 0 || results2TP53.length > 0) {
				return {
					...state,
					TP53files: action.payload
				};
			} else {
				return state;
			}
		case 'SETABL1FILES':
			const newABL1File = action.payload as File[];
			const resultsABL1 = newABL1File.filter(({ name: id1 }) => !state.ABL1files.some(({ name: id2 }) => id2 === id1));
			const results2ABL1 = state.ABL1files.filter(({ name: id1 }) => !newABL1File.some(({ name: id2 }) => id2 === id1));
			if (resultsABL1.length > 0 || results2ABL1.length > 0) {
				return {
					...state,
					ABL1files: action.payload
				};
			} else {
				return state;
			}
		case 'SETMYELOIDANALYSIS':
			return {
				...state,
				Myeloidanalysis: action.payload
			}
		case 'SETMPNANALYSIS':
			return {
				...state,
				MPNanalysis: action.payload
			}
		case 'SETTP53ANALYSIS':
			return {
				...state,
				TP53analysis: action.payload
			}
		case 'SETABL1ANALYSIS':
			return {
				...state,
				ABL1analysis: action.payload
			}
		case 'SETMERGEFILES':
			return {
				...state,
				Mergefiles: action.payload
			}
		case 'UPDATEFILE':
			const updatedFile = action.payload as { file: File, bed: string };
			if (updatedFile.bed === "Myeloid") {
				const updatedFiles = state.Myeloidfiles.map((file: File) => {
					if (file.name.split("_")[0] === updatedFile.file.name.split("_")[0]) {
						updatedFile.file.name = `${updatedFile.file.name.split("_")[0]}_${updatedFile.file.disease.abbr}`
						try {
							axios.post(`${ApiUrl}/api/updateFile`, {
								oldSampleName: file.name,
								newSampleName: updatedFile.file.name,
								bed: updatedFile.bed
							});
						} catch (error) {
							console.log(error);
						}
						return updatedFile
					}
					return file;
				});
				return {
					...state,
					files: updatedFiles
				}
			} else if (updatedFile.bed === "MPN") {
				const updatedFiles = state.MPNfiles.map((file: File) => {
					if (file.name.split("_")[0] === updatedFile.file.name.split("_")[0]) {
						updatedFile.file.name = `${updatedFile.file.name.split("_")[0]}_${updatedFile.file.disease.abbr}`
						try {
							axios.post(`${ApiUrl}/api/updateFile`, {
								oldSampleName: file.name,
								newSampleName: updatedFile.file.name,
								bed: updatedFile.bed
							});
						} catch (error) {
							console.log(error);
						}
						return updatedFile
					}
					return file;
				});
				return {
					...state,
					files: updatedFiles
				}

			} else if (updatedFile.bed === "ABL1") {
				const updatedFiles = state.ABL1files.map((file: File) => {
					if (file.name.split("_")[0] === updatedFile.file.name.split("_")[0]) {
						updatedFile.file.name = `${updatedFile.file.name.split("_")[0]}_${updatedFile.file.disease.abbr}`
						try {
							axios.post(`${ApiUrl}/api/updateFile`, {
								oldSampleName: file.name,
								newSampleName: updatedFile.file.name,
								bed: updatedFile.bed
							});
						} catch (error) {
							console.log(error);
						}
						return updatedFile
					}
					return file;
				});
				return {
					...state,
					files: updatedFiles
				}

			}
			else {
				const updatedFiles = state.TP53files.map((file: File) => {
					if (file.name.split("_")[0] === updatedFile.file.name.split("_")[0]) {
						updatedFile.file.name = `${updatedFile.file.name.split("_")[0]}_${updatedFile.file.disease.abbr}`
						try {
							axios.post(`${ApiUrl}/api/updateFile`, {
								oldSampleName: file.name,
								newSampleName: updatedFile.file.name,
								bed: updatedFile.bed
							});
						} catch (error) {
							console.log(error);
						}
						return updatedFile
					}
					return file;
				});
				return {
					...state,
					files: updatedFiles
				}
			}
		case 'UPDATEFILEINFO':
			const updatedFileInfo = action.payload as { file: File, bed: string };
			if (updatedFileInfo.bed === "Myeloid") {
				const updatedFilesInfo = state.Myeloidfiles.map((file: File) => {
					if (file.name.split("_")[0] === updatedFileInfo.file.name.split("_")[0]) {
						return updatedFileInfo;
					}
					return file;
				});
				return {
					...state,
					files: updatedFilesInfo
				}
			} else if (updatedFileInfo.bed === "MPN") {
				const updatedFilesInfo = state.MPNfiles.map((file: File) => {
					if (file.name.split("_")[0] === updatedFileInfo.file.name.split("_")[0]) {
						return updatedFileInfo;
					}
					return file;
				});
				return {
					...state,
					files: updatedFilesInfo
				}
			} else if (updatedFileInfo.bed === "ABL1") {
				const updatedFilesInfo = state.MPNfiles.map((file: File) => {
					if (file.name.split("_")[0] === updatedFileInfo.file.name.split("_")[0]) {
						return updatedFileInfo;
					}
					return file;
				});
				return {
					...state,
					files: updatedFilesInfo
				}
			}
			else {
				const updatedFilesInfo = state.TP53files.map((file: File) => {
					if (file.name.split("_")[0] === updatedFileInfo.file.name.split("_")[0]) {
						return updatedFileInfo;
					}
					return file;
				});
				return {
					...state,
					files: updatedFilesInfo
				}
			}


		default:
			return state;
	}
};
