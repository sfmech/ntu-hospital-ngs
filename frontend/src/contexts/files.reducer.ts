import { File } from "../models/file.model";
import axios from 'axios';
import { ApiUrl } from '../constants/constants';

export const FileReducer = (state, action) => {
	switch (action.type) {
		case 'SETFILES':
			const newFile = action.payload as File[];
			const results = newFile.filter(({ name: id1 }) => !state.files.some(({ name: id2 }) => id2 === id1));
			const results2 = state.files.filter(({ name: id1 }) => !newFile.some(({ name: id2 }) => id2 === id1));
			if (results.length>0 || results2.length>0){
				return {
					...state,
					files: action.payload
				};
			}else{
				return state;
			}
			
		case 'SETANALYSIS':
			return{
				...state,
				analysis: action.payload
			}
		case 'UPDATEFILE':
			const updatedFile = action.payload as File;
			
            const updatedFiles = state.files.map((file: File) => {
                if (file.name.split("_")[0] === updatedFile.name.split("_")[0]){
					updatedFile.name = `${updatedFile.name.split("_")[0]}_${updatedFile.disease.abbr}`
					try {
						axios.post(`${ApiUrl}/api/updateFile`,{
							oldSampleName:file.name,
							newSampleName:updatedFile.name
						});
					} catch (error) {
						console.log(error);
					}
					return updatedFile
				}
                return file;
            });
			return{
				...state,
				files: updatedFiles
			}
		case 'UPDATEFILEINFO':
			const updatedFileInfo = action.payload as File;
			
            const updatedFilesInfo = state.files.map((file: File) => {
                if (file.name.split("_")[0] === updatedFileInfo.name.split("_")[0]){
					return updatedFileInfo;
				}
                return file;
            });
			return{
				...state,
				files: updatedFilesInfo
			}
		default:
			return state;
	}
};
